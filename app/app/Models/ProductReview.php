<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class ProductReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'order_id',
        'rating',
        'title',
        'comment',
        'images',
        'is_verified_purchase',
        'is_approved',
        'helpful_count',
        'not_helpful_count',
        'approved_at',
    ];

    protected $casts = [
        'rating' => 'integer',
        'images' => 'array',
        'is_verified_purchase' => 'boolean',
        'is_approved' => 'boolean',
        'helpful_count' => 'integer',
        'not_helpful_count' => 'integer',
        'approved_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function helpfulnessVotes(): HasMany
    {
        return $this->hasMany(ReviewHelpfulness::class);
    }

    /**
     * Scopes
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeVerifiedPurchase($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    public function scopeWithImages($query)
    {
        return $query->whereNotNull('images')->where('images', '!=', '[]');
    }

    /**
     * Accessors & Mutators
     */
    public function getFormattedCreatedAtAttribute()
    {
        return $this->created_at->format('d F Y');
    }

    public function getReviewImagesAttribute()
    {
        if (!$this->images) {
            return [];
        }

        return collect($this->images)->map(function ($image) {
            return Storage::url($image);
        })->toArray();
    }

    public function getStarsArrayAttribute()
    {
        return array_fill(0, 5, false);
    }

    public function getFilledStarsAttribute()
    {
        $stars = $this->stars_array;
        for ($i = 0; $i < $this->rating; $i++) {
            $stars[$i] = true;
        }
        return $stars;
    }

    /**
     * Helper Methods
     */
    public function markAsHelpful(User $user): bool
    {
        $existing = $this->helpfulnessVotes()
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            if (!$existing->is_helpful) {
                $existing->update(['is_helpful' => true]);
                $this->decrement('not_helpful_count');
                $this->increment('helpful_count');
                return true;
            }
            return false; // Already marked as helpful
        }

        $this->helpfulnessVotes()->create([
            'user_id' => $user->id,
            'is_helpful' => true,
        ]);

        $this->increment('helpful_count');
        return true;
    }

    public function markAsNotHelpful(User $user): bool
    {
        $existing = $this->helpfulnessVotes()
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            if ($existing->is_helpful) {
                $existing->update(['is_helpful' => false]);
                $this->decrement('helpful_count');
                $this->increment('not_helpful_count');
                return true;
            }
            return false; // Already marked as not helpful
        }

        $this->helpfulnessVotes()->create([
            'user_id' => $user->id,
            'is_helpful' => false,
        ]);

        $this->increment('not_helpful_count');
        return true;
    }

    public function getUserHelpfulnessVote(User $user)
    {
        return $this->helpfulnessVotes()
            ->where('user_id', $user->id)
            ->first();
    }

    public function approve(): void
    {
        $this->update([
            'is_approved' => true,
            'approved_at' => now(),
        ]);
    }

    public function reject(): void
    {
        $this->update([
            'is_approved' => false,
            'approved_at' => null,
        ]);
    }

    public function getHelpfulnessRatio(): float
    {
        $total = $this->helpful_count + $this->not_helpful_count;
        if ($total === 0) {
            return 0;
        }

        return round(($this->helpful_count / $total) * 100, 1);
    }
}