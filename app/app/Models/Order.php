<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'status',
        'shipping_address',
        'shipping_method',
        'shipping_cost',
        'payment_method',
        'payment_status',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'shipping_address' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Check if payment has expired
     */
    public function isPaymentExpired(): bool
    {
        if ($this->status === 'paid' || $this->status === 'cancelled') {
            return false;
        }

        $timeoutHours = config('midtrans.payment_timeout', 24);
        $expiresAt = $this->created_at->addHours($timeoutHours);
        
        return now()->isAfter($expiresAt);
    }

    /**
     * Get payment expiry time
     */
    public function getPaymentExpiryTime()
    {
        $timeoutHours = config('midtrans.payment_timeout', 24);
        return $this->created_at->addHours($timeoutHours);
    }

    /**
     * Get time remaining for payment
     */
    public function getPaymentTimeRemaining()
    {
        if ($this->isPaymentExpired()) {
            return null;
        }

        $expiryTime = $this->getPaymentExpiryTime();
        return now()->diffInMinutes($expiryTime);
    }
}
