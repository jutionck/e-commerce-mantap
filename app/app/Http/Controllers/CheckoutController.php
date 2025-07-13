<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'totalAmount' => $totalAmount,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address' => 'required|string',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.postal_code' => 'required|string|max:10',
            'shipping_method' => 'required|string',
            'shipping_cost' => 'required|numeric|min:0',
        ]);

        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Keranjang belanja kosong');
        }

        DB::beginTransaction();

        try {
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
                'shipping_address' => $request->shipping_address,
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

            // Redirect to payment page
            return redirect()->route('payments.index', $order)
                ->with('success', 'Pesanan berhasil dibuat. Silakan lakukan pembayaran.');
        } catch (\Exception $e) {
            DB::rollback();

            return back()->with('error', $e->getMessage());
        }
    }
}
