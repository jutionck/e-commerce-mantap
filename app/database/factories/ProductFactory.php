<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        
        // Use local demo images
        $imageUrls = [
            '/images/demo/kemeja.svg',
            '/images/demo/gaun.svg', 
            '/images/demo/smartphone.svg',
            '/images/demo/novel.svg',
            '/images/demo/serum.svg',
        ];

        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'category_id' => 1, // Will be overridden in tests
            'description' => $this->faker->paragraph(3),
            'image' => $this->faker->randomElement($imageUrls),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'stock' => $this->faker->numberBetween(0, 100),
        ];
    }
}
