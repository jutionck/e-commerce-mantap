<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'transaction_id',
        'payment_method',
        'payment_type',
        'amount',
        'status',
        'snap_token',
        'transaction_type',
        'va_number',
        'bank',
        'gross_amount',
        'fraud_status',
        'settlement_time',
        'response_data',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gross_amount' => 'decimal:2',
        'settlement_time' => 'datetime',
        'response_data' => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
