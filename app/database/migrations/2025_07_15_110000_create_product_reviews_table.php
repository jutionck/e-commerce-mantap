<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->nullable()->constrained()->onDelete('set null'); // For verified purchase
            $table->integer('rating')->unsigned(); // 1-5 stars
            $table->string('title')->nullable();
            $table->text('comment')->nullable();
            $table->json('images')->nullable(); // Store review image paths
            $table->boolean('is_verified_purchase')->default(false);
            $table->boolean('is_approved')->default(true); // For moderation
            $table->integer('helpful_count')->default(0); // Helpful votes
            $table->integer('not_helpful_count')->default(0); // Not helpful votes
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            // Ensure one review per user per product
            $table->unique(['user_id', 'product_id']);
            
            // Indexes for performance
            $table->index(['product_id', 'is_approved']);
            $table->index(['rating']);
            $table->index(['is_verified_purchase']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
    }
};