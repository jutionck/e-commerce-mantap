<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'images'])->latest()->get();
        $categories = Category::all();

        // Add primary image and all images to each product
        $products->transform(function ($product) {
            $product->primary_image = $product->primaryImage();
            $product->all_images = $product->allImages();

            return $product;
        });

        return Inertia::render('Index', [
            'products' => $products,
            'categories' => $categories,
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
