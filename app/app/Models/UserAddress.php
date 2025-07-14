<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'label',
        'name',
        'phone',
        'address',
        'city',
        'postal_code',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Get the user that owns the address.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full address as a formatted string.
     */
    public function getFullAddressAttribute()
    {
        return "{$this->address}, {$this->city} {$this->postal_code}";
    }

    /**
     * Get the address as an array (compatible with existing order structure).
     */
    public function toShippingArray()
    {
        return [
            'name' => $this->name,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'postal_code' => $this->postal_code,
        ];
    }

    /**
     * Set an address as default and unset other default addresses for the user.
     */
    public function setAsDefault()
    {
        // Remove default flag from all other addresses for this user
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        // Set this address as default
        $this->update(['is_default' => true]);
    }

    /**
     * Get the default address for a user.
     */
    public static function getDefaultForUser($userId)
    {
        return static::where('user_id', $userId)
            ->where('is_default', true)
            ->first();
    }
}