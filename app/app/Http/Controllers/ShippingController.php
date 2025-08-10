<?php

namespace App\Http\Controllers;

use App\Services\RajaOngkirService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ShippingController extends Controller
{
    protected $rajaOngkirService;

    public function __construct(RajaOngkirService $rajaOngkirService)
    {
        $this->rajaOngkirService = $rajaOngkirService;
    }

    /**
     * Get shipping cost options
     */
    public function getShippingCost(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'destination' => 'required|string',
            'weight' => 'sometimes|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid request parameters',
                'details' => $validator->errors()
            ], 422);
        }

        $destinationCity = $request->input('destination');
        $weight = $request->input('weight', config('rajaongkir.default_weight', 1000));
        $originCityId = config('rajaongkir.default_origin_city');

        Log::info('Shipping cost request', [
            'destination' => $destinationCity,
            'weight' => $weight,
            'origin_city_id' => $originCityId
        ]);

        try {
            // Find destination city ID
            $destinationCityData = $this->rajaOngkirService->findCityByName($destinationCity);
            
            if (!$destinationCityData) {
                Log::warning('Destination city not found', [
                    'destination' => $destinationCity,
                    'api_key_status' => config('rajaongkir.api_key') ? 'configured' : 'missing'
                ]);

                // Check if this is due to API key issue
                $cities = $this->rajaOngkirService->getCities();
                if (empty($cities)) {
                    return response()->json([
                        'message' => 'Menggunakan estimasi harga pengiriman (API tidak tersedia)',
                        'info' => 'API RajaOngkir sedang dalam masa transisi. Harga pengiriman adalah estimasi dan akan dikonfirmasi saat proses order.',
                        'warning' => 'Untuk harga akurat, silakan hubungi customer service',
                        'weight' => $weight,
                        'options' => $this->rajaOngkirService->getFallbackOptions($weight)
                    ]);
                }

                return response()->json([
                    'error' => 'Kota tujuan tidak ditemukan',
                    'suggestion' => 'Coba gunakan nama kota yang lebih umum (contoh: Jakarta, Bandung, Surabaya)',
                    'example_cities' => ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Yogyakarta', 'Semarang'],
                    'fallback_options' => $this->rajaOngkirService->getFallbackOptions($weight)
                ], 404);
            }

            $destinationCityId = $destinationCityData['city_id'];

            Log::info('Found destination city', [
                'city_id' => $destinationCityId,
                'city_name' => $destinationCityData['city_name'],
                'province' => $destinationCityData['province']
            ]);

            // Get shipping options from RajaOngkir API
            $shippingOptions = $this->rajaOngkirService->getShippingCost(
                $originCityId,
                $destinationCityId,
                $weight
            );

            if (empty($shippingOptions)) {
                Log::warning('No shipping options returned from API', [
                    'origin' => $originCityId,
                    'destination' => $destinationCityId,
                    'weight' => $weight
                ]);

                return response()->json([
                    'message' => 'Menggunakan estimasi harga pengiriman',
                    'weight' => $weight,
                    'options' => $this->rajaOngkirService->getFallbackOptions($weight)
                ]);
            }

            return response()->json([
                'success' => true,
                'destination_city' => $destinationCityData,
                'weight' => $weight,
                'options' => $shippingOptions
            ]);

        } catch (\Exception $e) {
            Log::error('Shipping cost calculation failed', [
                'error' => $e->getMessage(),
                'destination' => $destinationCity,
                'weight' => $weight
            ]);

            return response()->json([
                'error' => 'Gagal menghitung ongkos kirim',
                'message' => 'Menggunakan estimasi harga pengiriman',
                'weight' => $weight,
                'options' => $this->rajaOngkirService->getFallbackOptions($weight)
            ], 500);
        }
    }

    /**
     * Get list of provinces for city selection
     */
    public function getProvinces()
    {
        try {
            $provinces = $this->rajaOngkirService->getProvinces();
            
            return response()->json([
                'success' => true,
                'provinces' => $provinces
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get provinces', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Gagal mengambil daftar provinsi'
            ], 500);
        }
    }

    /**
     * Get list of cities by province
     */
    public function getCities(Request $request)
    {
        $provinceId = $request->input('province_id');
        
        try {
            $cities = $this->rajaOngkirService->getCities($provinceId);
            
            return response()->json([
                'success' => true,
                'cities' => $cities
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get cities', [
                'error' => $e->getMessage(),
                'province_id' => $provinceId
            ]);

            return response()->json([
                'error' => 'Gagal mengambil daftar kota'
            ], 500);
        }
    }
}
