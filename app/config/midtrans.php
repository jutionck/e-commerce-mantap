<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Midtrans Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for Midtrans payment gateway.
    | You can find your Server Key and Client Key in your Midtrans dashboard.
    |
    */

    'server_key' => env('MIDTRANS_SERVER_KEY'),
    'client_key' => env('MIDTRANS_CLIENT_KEY'),
    'environment' => env('MIDTRANS_ENVIRONMENT', 'sandbox'), // 'sandbox' or 'production'
    'sanitized' => env('MIDTRANS_SANITIZED', true),
    '3ds' => env('MIDTRANS_3DS', true),

    /*
    |--------------------------------------------------------------------------
    | Midtrans API URLs
    |--------------------------------------------------------------------------
    */

    'urls' => [
        'sandbox' => [
            'snap' => 'https://app.sandbox.midtrans.com/snap/snap.js',
            'api' => 'https://api.sandbox.midtrans.com/v2',
        ],
        'production' => [
            'snap' => 'https://app.midtrans.com/snap/snap.js',
            'api' => 'https://api.midtrans.com/v2',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Settings
    |--------------------------------------------------------------------------
    */

    'payment_timeout' => 24, // hours
    'enabled_payments' => [
        'credit_card',
        'gopay',
        'qris',
        'shopeepay',
        'bca_va',
        'bni_va',
        'bri_va',
        'echannel',
        'permata_va',
        'other_va',
        'cstore',
        'dana',
        'linkaja',
        'ovo',
        'akulaku',
    ],

    /*
    |--------------------------------------------------------------------------
    | Credit Card Settings
    |--------------------------------------------------------------------------
    */

    'credit_card' => [
        'secure' => true,
        'channel' => 'migs',
        'bank' => 'bca',
        'installment' => [
            'required' => false,
            'terms' => [
                'bni' => [3, 6, 12],
                'mandiri' => [3, 6, 12],
                'cimb' => [3],
                'bca' => [3, 6, 12],
                'offline' => [6, 12],
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Expiry
    |--------------------------------------------------------------------------
    */

    'custom_expiry' => [
        'order_time' => date('Y-m-d H:i:s O'),
        'expiry_duration' => 24,
        'unit' => 'hour', // day, hour, minute
    ],
];
