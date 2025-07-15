<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Keranjang belanja kosong');
        }

        $cartItems = [];
        $totalAmount = 0;

        foreach ($cart as $productId => $item) {
            // Handle different cart formats
            if (is_numeric($productId) && isset($item['name'])) {
                // Cart from array format, find by name
                $product = Product::where('name', $item['name'])->first();
            } else {
                // Normal format with product ID as key
                $product = Product::find($productId);
            }

            if ($product) {
                $subtotal = $product->price * $item['quantity'];
                $cartItems[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $subtotal,
                ];
                $totalAmount += $subtotal;
            }
        }

        // Get user's saved addresses
        $addresses = Auth::user()->addresses()->orderBy('is_default', 'desc')->get();
        $defaultAddress = Auth::user()->defaultAddress;

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'totalAmount' => $totalAmount,
            'addresses' => $addresses,
            'defaultAddress' => $defaultAddress,
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Checkout request received', [
            'user_id' => Auth::id(),
            'request_data' => $request->all()
        ]);

        // Create validation rules based on address option
        $rules = [
            'address_option' => 'required|string|in:saved,new',
            'shipping_method' => 'required|string',
            'shipping_cost' => 'required|numeric|min:0',
        ];

        if ($request->address_option === 'saved') {
            $rules['selected_address_id'] = 'required|integer';
        } else {
            $rules['shipping_address'] = 'required|array';
            $rules['shipping_address.name'] = 'required|string|max:255';
            $rules['shipping_address.phone'] = 'required|string|max:20';
            $rules['shipping_address.address'] = 'required|string';
            $rules['shipping_address.city'] = 'required|string|max:100';
            $rules['shipping_address.postal_code'] = 'required|string|max:10';
            $rules['save_address'] = 'boolean';
            $rules['address_label'] = 'nullable|string|max:255';
        }

        $validation = $request->validate($rules);

        // Additional validation: ensure selected address belongs to current user
        if ($request->address_option === 'saved' && $request->selected_address_id) {
            $address = UserAddress::where('id', $request->selected_address_id)
                ->where('user_id', Auth::id())
                ->first();
            
            if (!$address) {
                Log::error('Invalid address selection', [
                    'user_id' => Auth::id(),
                    'selected_address_id' => $request->selected_address_id,
                    'available_addresses' => Auth::user()->addresses()->pluck('id')->toArray()
                ]);
                
                return back()->withErrors([
                    'selected_address_id' => 'The selected address is invalid or does not belong to you.'
                ])->withInput();
            }
        }

        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Keranjang belanja kosong');
        }

        DB::beginTransaction();

        try {
            // Get shipping address based on option
            $shippingAddress = $this->getShippingAddress($request);
            
            // Calculate total
            $subtotal = 0;
            $orderItems = [];

            // Handle different cart formats
            foreach ($cart as $productId => $item) {
                // If cart is in numeric array format (from CartController), extract product ID
                if (is_numeric($productId) && isset($item['name'])) {
                    // Find product by name (fallback method)
                    $product = Product::where('name', $item['name'])->first();
                    if (! $product) {
                        throw new \Exception('Produk tidak ditemukan: '.$item['name']);
                    }
                    $actualProductId = $product->id;
                } else {
                    // Normal format with product ID as key
                    $product = Product::find($productId);
                    if (! $product) {
                        throw new \Exception('Produk tidak ditemukan');
                    }
                    $actualProductId = $productId;
                }

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok produk {$product->name} tidak mencukupi");
                }

                $itemTotal = $product->price * $item['quantity'];
                $subtotal += $itemTotal;

                $orderItems[] = [
                    'product_id' => $actualProductId,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'total' => $itemTotal,
                ];
            }

            $totalAmount = $subtotal + $request->shipping_cost;

            if (! Auth::check()) {
                return redirect()->route('login')->with('error', 'Please login to continue checkout.');
            }

            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-'.strtoupper(Str::random(8)),
                'total_amount' => $totalAmount,
                'status' => 'pending_payment',
                'shipping_address' => $shippingAddress,
                'shipping_method' => $request->shipping_method,
                'shipping_cost' => $request->shipping_cost,
            ]);

            if (! $order || ! $order->id) {
                throw new \Exception('Order creation failed - no ID returned');
            }

            // Create order items
            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['total'],
                ]);

                // Update product stock
                $product = Product::find($item['product_id']);
                $product->decrement('stock', $item['quantity']);
            }

            // Clear cart
            session()->forget('cart');

            DB::commit();

            // Log successful order creation
            Log::info('Order created successfully', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'user_id' => Auth::id(),
                'total_amount' => $order->total_amount,
                'redirect_url' => route('payments.index', $order)
            ]);

            // Redirect to payment page
            return redirect()->route('payments.index', $order)
                ->with('success', 'Pesanan berhasil dibuat. Silakan lakukan pembayaran.');
        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Checkout process failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);

            return back()->with('error', 'Order creation failed: ' . $e->getMessage());
        }
    }

    private function getShippingAddress(Request $request)
    {
        if ($request->address_option === 'saved') {
            // Use saved address
            $address = UserAddress::where('user_id', Auth::id())
                ->where('id', $request->selected_address_id)
                ->first();
                
            if (!$address) {
                throw new \Exception('Alamat yang dipilih tidak ditemukan');
            }
            
            return $address->toShippingArray();
        } else {
            // Use new address
            $addressData = $request->shipping_address;
            
            // Save address if requested
            if ($request->save_address) {
                $savedAddress = Auth::user()->addresses()->create([
                    'label' => $request->address_label ?: 'Alamat Baru',
                    'name' => $addressData['name'],
                    'phone' => $addressData['phone'],
                    'address' => $addressData['address'],
                    'city' => $addressData['city'],
                    'postal_code' => $addressData['postal_code'],
                    'is_default' => Auth::user()->addresses()->count() === 0, // Set as default if it's the first address
                ]);
            }
            
            return $addressData;
        }
    }
}
