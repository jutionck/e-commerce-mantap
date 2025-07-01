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
                'image' => '/images/demo/kemeja.svg',
                'price' => 250000,
                'stock' => 50,
            ],
            [
                'name' => 'Gaun Pesta Wanita',
                'category_id' => 2,
                'description' => 'Gaun elegan untuk acara formal.',
                'image' => '/images/demo/gaun.svg',
                'price' => 750000,
                'stock' => 20,
            ],
            [
                'name' => 'Smartphone Terbaru',
                'category_id' => 3,
                'description' => 'Smartphone dengan kamera 108MP dan layar AMOLED.',
                'image' => '/images/demo/smartphone.svg',
                'price' => 5000000,
                'stock' => 15,
            ],
            [
                'name' => 'Novel Fiksi Ilmiah',
                'category_id' => 4,
                'description' => 'Novel tentang perjalanan waktu dan luar angkasa.',
                'image' => '/images/demo/novel.svg',
                'price' => 120000,
                'stock' => 100,
            ],
            [
                'name' => 'Serum Pencerah Wajah',
                'category_id' => 5,
                'description' => 'Serum untuk mencerahkan dan melembabkan kulit.',
                'image' => '/images/demo/serum.svg',
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
