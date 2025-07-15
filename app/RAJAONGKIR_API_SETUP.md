# RajaOngkir API Key Setup Guide

## Current Issue
The current API key in `.env` is invalid and returns error:
```
"Invalid key. API key tidak ditemukan di database RajaOngkir."
```

## How to Get Valid API Key

### Option 1: Free Starter Account
1. Visit [https://rajaongkir.com/](https://rajaongkir.com/)
2. Click "Daftar" (Register)
3. Fill registration form:
   - Name, Email, Phone
   - Choose "Starter" plan (FREE)
4. Verify your email
5. Login to dashboard
6. Go to "API Key" section
7. Copy your API key

### Option 2: Use Test Mode (Development)
While waiting for real API key, you can:

1. **Leave API key empty** in `.env`:
   ```env
   RAJAONGKIR_API_KEY=
   ```
   
2. **Or comment it out**:
   ```env
   # RAJAONGKIR_API_KEY=your_key_here
   ```

The system will automatically use **fallback shipping options** with estimated costs:
- JNE REG: Rp 10.000 (2-3 hari)
- JNE YES: Rp 20.000 (1 hari) 
- TIKI REG: Rp 12.000 (2-3 hari)

## Setting Up Real API Key

1. **Get your API key** from RajaOngkir dashboard
2. **Update `.env` file**:
   ```env
   RAJAONGKIR_API_KEY=your_actual_api_key_here
   ```
3. **Clear cache** (if using cache):
   ```bash
   php artisan cache:clear
   ```

## Starter Plan Limitations

RajaOngkir Starter (FREE) has limitations:
- **1000 requests/month**
- **3 couriers only**: JNE, POS Indonesia, TIKI
- **Basic cities coverage**

## API Key Format Example
Valid RajaOngkir API keys typically look like:
```
abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```
(48-64 characters, alphanumeric)

## Testing Your API Key

Run the debug script to test:
```bash
php debug_shipping.php
```

Look for:
- ✅ API Connection: SUCCESS
- ✅ Provinces available: 34
- ✅ Total cities available: 501+

## Troubleshooting

### Error: "Invalid key"
- API key is wrong or not activated
- Check RajaOngkir dashboard
- Make sure account is verified

### Error: "Quota exceeded"
- You've used 1000 requests this month
- Wait for next month or upgrade plan

### Cities not found
- City name might not be in RajaOngkir database
- Try common city names: Jakarta, Bandung, Surabaya
- System will use fallback options automatically

## Fallback System Benefits

Even without valid API key, shipping works with:
- ✅ Estimated shipping costs
- ✅ Multiple courier options  
- ✅ Checkout process continues
- ✅ No broken user experience

## Production Recommendations

For production use:
1. **Get valid API key** from RajaOngkir
2. **Consider Pro plan** for more features:
   - More couriers (J&T, SiCepat, etc.)
   - Higher quota
   - Better city coverage
3. **Monitor API usage** in RajaOngkir dashboard
4. **Set up alerts** for quota limits