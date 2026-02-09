<?php

return [
    /*
    |--------------------------------------------------------------------------
    | RajaOngkir API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for RajaOngkir shipping cost calculation API
    | Get your API key from: https://rajaongkir.com/
    |
    */

    'api_key' => env('RAJAONGKIR_API_KEY'),
    
    'base_url' => env('RAJAONGKIR_BASE_URL', 'https://rajaongkir.komerce.id/api/v1'),
    
    'endpoints' => [
        'city' => '/city',
        'province' => '/province', 
        'cost' => '/cost',
    ],
    
    'supported_couriers' => [
        'jne' => 'JNE',
        'pos' => 'POS Indonesia', 
        'tiki' => 'TIKI',
    ],
    
    'default_origin_city' => env('RAJAONGKIR_ORIGIN_CITY', '153'), // Jakarta Pusat default
    
    'default_weight' => 1000, // grams (1kg default if no product weight)
    
    'timeout' => 30, // seconds
];