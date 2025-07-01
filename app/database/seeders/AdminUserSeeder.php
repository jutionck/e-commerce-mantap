<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        \App\Models\User::create([
            'name' => 'Administrator',
            'email' => 'admin@ecommerce.com',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'admin_verified_at' => now(),
        ]);

        // Create demo customer user
        \App\Models\User::create([
            'name' => 'Demo Customer',
            'email' => 'customer@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('customer123'),
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Admin user created: admin@ecommerce.com / admin123');
        $this->command->info('Demo customer created: customer@example.com / customer123');
    }
}
