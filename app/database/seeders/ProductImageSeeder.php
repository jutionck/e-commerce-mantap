<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();

        foreach ($products as $product) {
            // Create 5 images per product using the same image for all variations
            $imageVariations = [
                'main' => $product->image, // Use existing image as main
                'angle1' => $product->image, // Same image for now
                'angle2' => $product->image, // Same image for now  
                'detail1' => $product->image, // Same image for now
                'detail2' => $product->image, // Same image for now
            ];

            $sortOrder = 0;
            foreach ($imageVariations as $type => $imageUrl) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $imageUrl ?: '/images/product_placeholder.png',
                    'sort_order' => $sortOrder,
                    'is_primary' => $sortOrder === 0, // First image is primary
                    'alt_text' => $product->name . ' - ' . ucfirst($type),
                ]);
                $sortOrder++;
            }
        }
    }
}
