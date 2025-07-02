<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'description',
        'image',
        'price',
        'stock',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): ?string
    {
        $primaryImage = $this->images()->where('is_primary', true)->first();
        if ($primaryImage) {
            return $primaryImage->image_url;
        }

        $firstImage = $this->images()->first();
        if ($firstImage) {
            return $firstImage->image_url;
        }

        return $this->image; // fallback to single image field
    }

    public function allImages(): array
    {
        $images = $this->images()->get()->pluck('image_url')->toArray();

        // If no images in product_images table, use the single image field
        if (empty($images) && $this->image) {
            return [$this->image, $this->image, $this->image, $this->image, $this->image]; // 5 images for demo
        }

        // Ensure we have at least 5 images for the gallery
        while (count($images) < 5) {
            $images[] = $images[0] ?? '/images/product_placeholder.png';
        }

        return array_slice($images, 0, 5);
    }
}
