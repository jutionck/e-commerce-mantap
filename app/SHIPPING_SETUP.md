# RajaOngkir API Integration Setup

This guide explains how to configure the RajaOngkir shipping API integration that has been implemented.

## What's Been Implemented

### 1. **RajaOngkir Service** (`app/Services/RajaOngkirService.php`)
- Real-time shipping cost calculation
- City/province lookup functionality  
- Support for multiple couriers (JNE, POS, TIKI)
- Automatic caching for better performance
- Fallback options when API is unavailable

### 2. **Enhanced Shipping Controller** (`app/Http/Controllers/ShippingController.php`)
- Weight-based shipping calculation
- Improved error handling
- City validation and matching
- Multiple API endpoints for provinces/cities

### 3. **Product Weight System**
- Added `weight` column to products table (in grams)
- Weight-based total calculation in checkout
- Default 1kg weight for products without specified weight

### 4. **Improved Checkout UI**
- Enhanced shipping options display
- Shows courier name, service type, cost, and estimated delivery time
- Better error handling and user feedback
- Real-time weight calculation from cart items

## Setup Instructions

### 1. Get RajaOngkir API Key
1. Visit [https://rajaongkir.com/](https://rajaongkir.com/)
2. Register for a free account
3. Get your API key from the dashboard

### 2. Configure Environment Variables
Add these to your `.env` file:

```env
# RajaOngkir Configuration
RAJAONGKIR_API_KEY=your_api_key_here
RAJAONGKIR_BASE_URL=https://api.rajaongkir.com/starter
RAJAONGKIR_ORIGIN_CITY=153
```

**Important:** 
- Replace `your_api_key_here` with your actual RajaOngkir API key
- `RAJAONGKIR_ORIGIN_CITY=153` is Jakarta Pusat (default). Change this to your store's city ID
- To find your city ID, use the RajaOngkir city API or check their documentation

### 3. Database Migration
The weight column has been added to the products table. If you need to run it manually:

```sql
ALTER TABLE products ADD COLUMN weight INTEGER DEFAULT 1000;
```

### 4. Configure Product Weights
Update your products to include weights (in grams):
- Access admin panel → Products → Edit each product
- Add weight in grams (e.g., 1000 for 1kg, 500 for 500g)
- Products without weight will default to 1kg

## API Endpoints Available

### Shipping Cost Calculation
```
POST /shipping-cost
{
    "destination": "Bandung",
    "weight": 2000
}
```

### Get Provinces
```
GET /shipping/provinces
```

### Get Cities
```
GET /shipping/cities?province_id=9
```

## Features

### Real-time Shipping Calculation
- Calculates actual shipping costs from RajaOngkir API
- Supports multiple couriers with different service levels
- Weight-based pricing for accurate costs

### Fallback System
- When API fails or city not found, shows estimated shipping costs
- Ensures checkout always works even if external API is down

### Caching
- Province and city data cached for 24 hours
- Improves performance and reduces API calls

### Enhanced UI
- Shows courier logos and service descriptions
- Displays estimated delivery time
- Better visual feedback for selected options

## Troubleshooting

### City Not Found
- The system tries multiple matching strategies (exact, partial, with type)
- If city not found, fallback options are provided
- Check if city name matches RajaOngkir's city database

### API Errors
- All API errors are logged in Laravel logs
- Fallback shipping options are automatically provided
- Check API key and network connectivity

### Weight Calculation
- Ensure products have weight values set
- Total weight is calculated from cart items: `(product_weight × quantity)`
- Minimum weight is 1kg even if calculated weight is less

## Testing

### With Real API Key
1. Set up your RajaOngkir API key
2. Test checkout with different cities
3. Verify shipping costs match RajaOngkir rates

### Without API Key (Fallback Mode)
1. Leave `RAJAONGKIR_API_KEY` empty
2. System will use fallback shipping options
3. Useful for development/testing

## Next Steps

### Potential Enhancements
1. **Shipping Tracking**: Track packages after delivery
2. **More Couriers**: Add J&T, SiCepat, Anteraja support  
3. **Bulk Shipping**: Special rates for bulk orders
4. **Express Delivery**: Same-day delivery options
5. **Free Shipping**: Minimum order amount rules

### Admin Features
1. Configure origin city from admin panel
2. Set shipping markup/discount percentages
3. Manage courier availability by region
4. Shipping cost reports and analytics