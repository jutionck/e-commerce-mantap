<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\RajaOngkirService;
use Illuminate\Support\Facades\Http;

class TestShippingApiCommand extends Command
{
    protected $signature = 'shipping:test';
    protected $description = 'Test shipping API connection and functionality';

    public function handle()
    {
        $this->info('🚢 Testing Shipping API Configuration...');
        $this->newLine();

        $rajaOngkirService = new RajaOngkirService();
        
        // 1. Check API Key Configuration
        $apiKey = config('rajaongkir.api_key');
        $baseUrl = config('rajaongkir.base_url');
        
        $this->info("📋 Configuration Status:");
        $this->line("   API Key: " . ($apiKey && $apiKey !== 'your-new-rajaongkir-api-key' ? '✅ Configured' : '❌ Missing/Default'));
        $this->line("   Base URL: {$baseUrl}");
        $this->newLine();

        if (!$apiKey || $apiKey === 'your-new-rajaongkir-api-key') {
            $this->error('❌ RajaOngkir API key not configured properly!');
            $this->info('📝 Please update RAJAONGKIR_API_KEY in your .env file');
            $this->info('🌐 Get new API key from: https://collaborator.komerce.id');
            $this->newLine();
        }

        // 2. Test API Connectivity
        $this->info('🌐 Testing API Connectivity...');
        
        try {
            $response = Http::timeout(10)
                ->withHeaders(['key' => $apiKey])
                ->get($baseUrl . '/province');

            if ($response->successful()) {
                $data = $response->json();
                $this->info('✅ API Connection: SUCCESS');
                $this->line("   Status: " . $data['rajaongkir']['status']['description']);
                
                $provinces = $data['rajaongkir']['results'];
                $this->line("   Provinces Available: " . count($provinces));
            } else {
                $this->error('❌ API Connection: FAILED');
                $this->line("   Status: " . $response->status());
                $this->line("   Response: " . $response->body());
            }
        } catch (\Exception $e) {
            $this->error('❌ API Connection: EXCEPTION');
            $this->line("   Error: " . $e->getMessage());
        }
        
        $this->newLine();

        // 3. Test Service Methods
        $this->info('🧪 Testing Service Methods...');
        
        // Test getProvinces
        $this->line('   Testing getProvinces()...');
        $provinces = $rajaOngkirService->getProvinces();
        
        if (!empty($provinces)) {
            $this->info("   ✅ Provinces: " . count($provinces) . " loaded");
            $this->line("   Sample: " . $provinces[0]['province']);
        } else {
            $this->error("   ❌ No provinces loaded");
        }

        // Test getCities
        $this->line('   Testing getCities()...');
        $cities = $rajaOngkirService->getCities();
        
        if (!empty($cities)) {
            $this->info("   ✅ Cities: " . count($cities) . " loaded");
            $this->line("   Sample: " . $cities[0]['city_name']);
        } else {
            $this->error("   ❌ No cities loaded");
        }

        // Test findCityByName
        $testCities = ['Jakarta', 'Bandung', 'Surabaya', 'Medan'];
        $this->line('   Testing findCityByName()...');
        
        foreach ($testCities as $cityName) {
            $city = $rajaOngkirService->findCityByName($cityName);
            if ($city) {
                $this->info("   ✅ {$cityName}: Found (ID: {$city['city_id']})");
            } else {
                $this->error("   ❌ {$cityName}: Not found");
            }
        }

        $this->newLine();

        // 4. Test Shipping Cost Calculation
        $this->info('💰 Testing Shipping Cost Calculation...');
        
        $jakarta = $rajaOngkirService->findCityByName('Jakarta');
        $originCityId = config('rajaongkir.default_origin_city', 153);
        
        if ($jakarta) {
            $shippingOptions = $rajaOngkirService->getShippingCost(
                $originCityId,
                $jakarta['city_id'],
                1000
            );
            
            if (!empty($shippingOptions)) {
                $this->info("   ✅ Shipping Options: " . count($shippingOptions) . " found");
                foreach ($shippingOptions as $option) {
                    $this->line("   • {$option['name']}: {$option['formatted_cost']} ({$option['formatted_estimate']})");
                }
            } else {
                $this->error("   ❌ No shipping options returned");
            }
        } else {
            $this->error("   ❌ Cannot test - Jakarta not found");
        }

        $this->newLine();

        // 5. Test Fallback Options
        $this->info('🔄 Testing Fallback Options...');
        $fallbackOptions = $rajaOngkirService->getFallbackOptions();
        
        if (!empty($fallbackOptions)) {
            $this->info("   ✅ Fallback Options: " . count($fallbackOptions) . " available");
            foreach ($fallbackOptions as $option) {
                $this->line("   • {$option['name']}: {$option['formatted_cost']} ({$option['formatted_estimate']})");
            }
        }

        $this->newLine();

        // 6. Summary and Recommendations
        $this->info('📊 Summary & Recommendations:');
        
        if (empty($provinces) && empty($cities)) {
            $this->error('❌ API not working - Using fallback system');
            $this->info('📝 Action Required:');
            $this->line('   1. Get new API key from https://collaborator.komerce.id');
            $this->line('   2. Update RAJAONGKIR_API_KEY in .env');
            $this->line('   3. Run: php artisan config:clear');
            $this->line('   4. Test again with: php artisan shipping:test');
        } else {
            $this->info('✅ Shipping API working properly');
            $this->line('   Application will use real-time shipping costs');
        }

        $this->newLine();
        $this->info('🏁 Test completed!');
        
        return 0;
    }
}