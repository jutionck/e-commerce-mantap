<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Wishlist;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'images'])->latest()->get();
        $categories = Category::all();

        // Get user's wishlist if authenticated
        $userWishlist = [];
        $wishlistCount = 0;
        if (auth()->check()) {
            $userWishlist = Wishlist::where('user_id', auth()->id())
                ->pluck('product_id')
                ->toArray();
            $wishlistCount = count($userWishlist);
        }

        // Add primary image, all images, and wishlist status to each product
        $products->transform(function ($product) use ($userWishlist) {
            $product->primary_image = $product->primaryImage();
            $product->all_images = $product->allImages();
            $product->is_wishlisted = in_array($product->id, $userWishlist);

            return $product;
        });

        return Inertia::render('Index', [
            'products' => $products,
            'categories' => $categories,
            'userWishlist' => $userWishlist,
            'wishlistCount' => $wishlistCount,
        ]);
    }

    public function show(Product $product)
    {
        // Get related products from the same category
        $relatedProducts = Product::with(['category', 'images'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('stock', '>', 0)
            ->limit(4)
            ->get();

        // Add images data to related products
        $relatedProducts->transform(function ($relatedProduct) {
            $relatedProduct->primary_image = $relatedProduct->primaryImage();
            $relatedProduct->all_images = $relatedProduct->allImages();

            return $relatedProduct;
        });

        // Load images for main product
        $product->load(['category', 'images']);
        $product->primary_image = $product->primaryImage();
        $product->all_images = $product->allImages();

        return Inertia::render('Product/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
