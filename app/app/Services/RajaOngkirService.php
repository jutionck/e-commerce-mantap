<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class RajaOngkirService
{
    protected $apiKey;
    protected $baseUrl;
    protected $timeout;

    public function __construct()
    {
        $this->apiKey = config('rajaongkir.api_key');
        $this->baseUrl = config('rajaongkir.base_url');
        $this->timeout = config('rajaongkir.timeout', 30);
    }

    /**
     * Get all provinces
     */
    public function getProvinces()
    {
        return Cache::remember('rajaongkir_provinces', 86400, function () {
            try {
                $response = Http::timeout($this->timeout)
                    ->withHeaders(['key' => $this->apiKey])
                    ->get($this->baseUrl . config('rajaongkir.endpoints.province'));

                if ($response->successful()) {
                    return $response->json()['rajaongkir']['results'];
                }

                Log::error('RajaOngkir provinces API failed', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);

                return [];
            } catch (\Exception $e) {
                Log::error('RajaOngkir provinces API exception', [
                    'error' => $e->getMessage()
                ]);

                return [];
            }
        });
    }

    /**
     * Get cities by province
     */
    public function getCities($provinceId = null)
    {
        $cacheKey = $provinceId ? "rajaongkir_cities_{$provinceId}" : 'rajaongkir_cities_all';
        
        return Cache::remember($cacheKey, 86400, function () use ($provinceId) {
            try {
                $url = $this->baseUrl . config('rajaongkir.endpoints.city');
                if ($provinceId) {
                    $url .= "?province={$provinceId}";
                }

                $response = Http::timeout($this->timeout)
                    ->withHeaders(['key' => $this->apiKey])
                    ->get($url);

                if ($response->successful()) {
                    return $response->json()['rajaongkir']['results'];
                }

                Log::error('RajaOngkir cities API failed', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);

                return [];
            } catch (\Exception $e) {
                Log::error('RajaOngkir cities API exception', [
                    'error' => $e->getMessage()
                ]);

                return [];
            }
        });
    }

    /**
     * Find city by name
     */
    public function findCityByName($cityName)
    {
        $cities = $this->getCities();
        
        // Try exact match first
        foreach ($cities as $city) {
            if (strcasecmp($city['city_name'], $cityName) === 0) {
                return $city;
            }
        }

        // Try partial match
        foreach ($cities as $city) {
            if (stripos($city['city_name'], $cityName) !== false) {
                return $city;
            }
        }

        // Try with type (Kota/Kabupaten)
        foreach ($cities as $city) {
            $fullName = $city['type'] . ' ' . $city['city_name'];
            if (stripos($fullName, $cityName) !== false) {
                return $city;
            }
        }

        return null;
    }

    /**
     * Get shipping costs
     */
    public function getShippingCost($originCityId, $destinationCityId, $weight, $couriers = null)
    {
        if (!$couriers) {
            $couriers = array_keys(config('rajaongkir.supported_couriers'));
        }

        if (is_string($couriers)) {
            $couriers = [$couriers];
        }

        $courierString = implode(':', $couriers);
        
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders(['key' => $this->apiKey])
                ->asForm()
                ->post($this->baseUrl . config('rajaongkir.endpoints.cost'), [
                    'origin' => $originCityId,
                    'destination' => $destinationCityId,
                    'weight' => $weight,
                    'courier' => $courierString,
                ]);

            if ($response->successful()) {
                $data = $response->json()['rajaongkir']['results'];
                return $this->formatShippingOptions($data);
            }

            Log::error('RajaOngkir cost API failed', [
                'status' => $response->status(),
                'response' => $response->body(),
                'request' => [
                    'origin' => $originCityId,
                    'destination' => $destinationCityId,
                    'weight' => $weight,
                    'courier' => $courierString,
                ]
            ]);

            return [];
        } catch (\Exception $e) {
            Log::error('RajaOngkir cost API exception', [
                'error' => $e->getMessage(),
                'request' => [
                    'origin' => $originCityId,
                    'destination' => $destinationCityId,
                    'weight' => $weight,
                    'courier' => $courierString,
                ]
            ]);

            return [];
        }
    }

    /**
     * Format shipping options for frontend
     */
    protected function formatShippingOptions($results)
    {
        $options = [];

        foreach ($results as $result) {
            $courierCode = $result['code'];
            $courierName = $result['name'];

            foreach ($result['costs'] as $cost) {
                $serviceName = $cost['service'];
                $serviceDescription = $cost['description'];
                $price = $cost['cost'][0]['value'];
                $estimatedDays = $cost['cost'][0]['etd'];

                // Clean up estimated days text
                $estimatedDays = str_replace(['HARI', 'hari'], '', $estimatedDays);
                $estimatedDays = trim($estimatedDays);

                $options[] = [
                    'courier_code' => $courierCode,
                    'courier_name' => $courierName,
                    'service' => $serviceName,
                    'service_description' => $serviceDescription,
                    'name' => "{$courierName} {$serviceName}",
                    'description' => $serviceDescription,
                    'cost' => $price,
                    'estimated_days' => $estimatedDays,
                    'formatted_cost' => 'Rp ' . number_format($price, 0, ',', '.'),
                    'formatted_estimate' => $estimatedDays ? "{$estimatedDays} hari" : 'Estimasi tidak tersedia',
                ];
            }
        }

        // Sort by price
        usort($options, function ($a, $b) {
            return $a['cost'] <=> $b['cost'];
        });

        return $options;
    }

    /**
     * Get fallback shipping options (when API fails)
     */
    public function getFallbackOptions()
    {
        return [
            [
                'courier_code' => 'jne',
                'courier_name' => 'JNE',
                'service' => 'REG',
                'service_description' => 'Layanan Reguler',
                'name' => 'JNE REG',
                'description' => 'Layanan Reguler',
                'cost' => 10000,
                'estimated_days' => '2-3',
                'formatted_cost' => 'Rp 10.000',
                'formatted_estimate' => '2-3 hari',
            ],
            [
                'courier_code' => 'jne',
                'courier_name' => 'JNE',
                'service' => 'YES',
                'service_description' => 'Yakin Esok Sampai',
                'name' => 'JNE YES',
                'description' => 'Yakin Esok Sampai',
                'cost' => 20000,
                'estimated_days' => '1',
                'formatted_cost' => 'Rp 20.000',
                'formatted_estimate' => '1 hari',
            ],
            [
                'courier_code' => 'tiki',
                'courier_name' => 'TIKI',
                'service' => 'REG',
                'service_description' => 'Regular Service',
                'name' => 'TIKI REG',
                'description' => 'Regular Service',
                'cost' => 12000,
                'estimated_days' => '2-3',
                'formatted_cost' => 'Rp 12.000',
                'formatted_estimate' => '2-3 hari',
            ],
        ];
    }
}