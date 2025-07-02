<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => '/storage/'.$path,
                    'sort_order' => $product->images()->count() + $index,
                    'is_primary' => $product->images()->count() === 0 && $index === 0,
                    'alt_text' => $product->name.' - Image '.($index + 1),
                ]);
            }
        }

        return back()->with('success', 'Images uploaded successfully.');
    }

    public function destroy(ProductImage $image)
    {
        // Delete file from storage
        if ($image->image_url && str_starts_with($image->image_url, '/storage/')) {
            $filePath = str_replace('/storage/', '', $image->image_url);
            Storage::disk('public')->delete($filePath);
        }

        $image->delete();

        return back()->with('success', 'Image deleted successfully.');
    }

    public function setPrimary(ProductImage $image)
    {
        // Reset all images of this product to not primary
        ProductImage::where('product_id', $image->product_id)
            ->update(['is_primary' => false]);

        // Set this image as primary
        $image->update(['is_primary' => true]);

        return back()->with('success', 'Primary image updated successfully.');
    }

    public function reorder(Request $request, Product $product)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|exists:product_images,id',
            'images.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($request->images as $imageData) {
            ProductImage::where('id', $imageData['id'])
                ->where('product_id', $product->id)
                ->update(['sort_order' => $imageData['sort_order']]);
        }

        return back()->with('success', 'Image order updated successfully.');
    }
}
