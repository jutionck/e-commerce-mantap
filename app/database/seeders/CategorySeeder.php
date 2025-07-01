<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Pakaian Pria',
            'Pakaian Wanita',
            'Elektronik',
            'Buku',
            'Kecantikan',
        ];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['slug' => Str::slug($category)],
                [
                    'name' => $category,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
