<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ShippingController extends Controller
{
    public function getShippingCost(Request $request)
    {
        $destination = $request->input('destination');

        // In a real application, you would make an API call to a shipping provider.
        // Here, we'll just return some mock data.
        $shippingOptions = [
            ['name' => 'JNE Reguler', 'cost' => 10],
            ['name' => 'JNE YES', 'cost' => 20],
            ['name' => 'J&T Express', 'cost' => 12],
        ];

        return response()->json($shippingOptions);
    }
}
