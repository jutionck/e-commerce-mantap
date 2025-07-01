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
        
        // Use online placeholder images for demo
        $imageUrls = [
            'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Product+1',
            'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Product+2',
            'https://via.placeholder.com/800x600/EC4899/FFFFFF?text=Product+3',
            'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Product+4',
            'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Product+5',
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
