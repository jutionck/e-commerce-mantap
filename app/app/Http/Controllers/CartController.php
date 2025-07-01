<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = session()->get('cart', []);

        return Inertia::render('Cart/Index', [
            'cart' => $cart
        ]);
    }

    public function store(Request $request)
    {
        $product = Product::findOrFail($request->input('product_id'));
        $quantity = $request->input('quantity', 1);

        $cart = session()->get('cart', []);

        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity'] += $quantity;
        } else {
            $cart[$product->id] = [
                'name' => $product->name,
                'quantity' => $quantity,
                'price' => $product->price
            ];
        }

        session()->put('cart', $cart);

        return redirect()->route('cart.index');
    }

    public function update(Request $request, $productId)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] = $request->input('quantity');
            session()->put('cart', $cart);
        }

        return redirect()->route('cart.index');
    }

    public function destroy($productId)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            session()->put('cart', $cart);
        }

        return redirect()->route('cart.index');
    }
}