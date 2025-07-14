<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlistItems = auth()->user()->wishlists()
            ->with(['product.category', 'product.images'])
            ->get()
            ->map(function ($wishlist) {
                $product = $wishlist->product;
                $product->primary_image = $product->images->where('is_primary', true)->first()?->image_path
                    ?? $product->images->first()?->image_path;
                return $product;
            });

        return Inertia::render('Wishlist/Index', [
            'wishlistItems' => $wishlistItems,
        ]);
    }

    public function toggle(Request $request, Product $product)
    {
        $user = auth()->user();
        
        $wishlistItem = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($wishlistItem) {
            // Remove from wishlist
            $wishlistItem->delete();
        } else {
            // Add to wishlist
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
            ]);
        }

        // Return success response for Inertia
        return back();
    }

    public function destroy(Product $product)
    {
        $user = auth()->user();
        
        $wishlistItem = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($wishlistItem) {
            $wishlistItem->delete();
        }

        return back();
    }
}
