<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'order_number' => 'ORD-' . strtoupper($this->faker->bothify('????####')),
            'status' => $this->faker->randomElement(['pending', 'processing', 'shipped', 'completed', 'cancelled']),
            'total' => $this->faker->numberBetween(50000, 1000000),
            'shipping_method' => $this->faker->randomElement(['JNE', 'JNT', 'POS Indonesia']),
            'shipping_cost' => $this->faker->numberBetween(10000, 50000),
            'shipping_address' => [
                'recipient_name' => $this->faker->name,
                'phone' => $this->faker->phoneNumber,
                'address' => $this->faker->address,
                'city' => $this->faker->city,
                'province' => $this->faker->state,
                'postal_code' => $this->faker->postcode,
            ],
            'payment_method' => $this->faker->randomElement(['bank_transfer', 'credit_card', 'e_wallet']),
            'payment_status' => $this->faker->randomElement(['pending', 'paid', 'failed']),
            'notes' => $this->faker->optional()->sentence,
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => now(),
        ];
    }

    /**
     * Create a completed order.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'payment_status' => 'paid',
        ]);
    }

    /**
     * Create a pending order.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);
    }

    /**
     * Create an order with specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}