<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Kemeja Lengan Panjang',
                'category_id' => 1,
                'description' => 'Kemeja formal untuk pria dengan bahan katun.',
                'image' => 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Kemeja',
                'price' => 250000,
                'stock' => 50,
            ],
            [
                'name' => 'Gaun Pesta Wanita',
                'category_id' => 2,
                'description' => 'Gaun elegan untuk acara formal.',
                'image' => 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Gaun',
                'price' => 750000,
                'stock' => 20,
            ],
            [
                'name' => 'Smartphone Terbaru',
                'category_id' => 3,
                'description' => 'Smartphone dengan kamera 108MP dan layar AMOLED.',
                'image' => 'https://via.placeholder.com/800x600/EC4899/FFFFFF?text=Smartphone',
                'price' => 5000000,
                'stock' => 15,
            ],
            [
                'name' => 'Novel Fiksi Ilmiah',
                'category_id' => 4,
                'description' => 'Novel tentang perjalanan waktu dan luar angkasa.',
                'image' => 'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Novel',
                'price' => 120000,
                'stock' => 100,
            ],
            [
                'name' => 'Serum Pencerah Wajah',
                'category_id' => 5,
                'description' => 'Serum untuk mencerahkan dan melembabkan kulit.',
                'image' => 'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Serum',
                'price' => 150000,
                'stock' => 75,
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->updateOrInsert(
                ['slug' => Str::slug($product['name'])],
                [
                    'name' => $product['name'],
                    'category_id' => $product['category_id'],
                    'description' => $product['description'],
                    'image' => $product['image'],
                    'price' => $product['price'],
                    'stock' => $product['stock'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
