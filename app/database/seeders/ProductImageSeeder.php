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
            // Create 5 images per product
            $imageVariations = [
                'main' => $product->image, // Use existing image as main
                'angle1' => str_replace('random=', 'angle1&random=', $product->image ?? ''),
                'angle2' => str_replace('random=', 'angle2&random=', $product->image ?? ''),
                'detail1' => str_replace('random=', 'detail1&random=', $product->image ?? ''),
                'detail2' => str_replace('random=', 'detail2&random=', $product->image ?? ''),
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
