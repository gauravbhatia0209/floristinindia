# 🔧 Upload Deployment Fix

## Current Issue

The upload API is returning 404 errors in production, causing "Unexpected token 'T'" JSON parsing errors.

## Problem Analysis

From the console logs, we can see:

```
/api/upload/image:1  Failed to load resource: the server responded with a status of 404 ()
```

This indicates the route `/api/upload/image` is not being found in the deployed environment.

## Solutions Implemented

### 1. Dedicated Upload Routes

Created specific API routes for Vercel:

- `api/upload/image.js` - Single image upload
- `api/upload/images.js` - Multiple images upload
- `api/upload-direct.js` - Direct test endpoint

### 2. Enhanced Error Handling

Updated `server/index.ts` with:

- JSON-only responses for all API routes
- Comprehensive 404 handling for API endpoints
- Detailed error logging

### 3. Improved API Routing

Updated `api/[...path].js` with:

- Better error handling
- Detailed logging for debugging
- Proper JSON error responses

## Testing Steps

### 1. Test Direct Upload Endpoint

```bash
curl -X POST -F "image=@test.jpg" https://your-site.vercel.app/api/upload-direct
```

Should return:

```json
{
  "success": true,
  "message": "File received successfully",
  "filename": "test.jpg",
  "mimetype": "image/jpeg",
  "size": 12345
}
```

### 2. Test Main Upload Endpoint

```bash
curl -X POST -F "image=@test.jpg" https://your-site.vercel.app/api/upload/image
```

Should return Supabase upload response or specific error.

### 3. Check API Routing

```bash
curl https://your-site.vercel.app/api/ping
```

Should return:

```json
{
  "message": "Hello from Express server v2!"
}
```

## Deployment Process

1. **Build**: `npm run build`
2. **Deploy**: Push to Vercel
3. **Test**: Use admin panel to upload images
4. **Debug**: Check Vercel function logs if still failing

## Common Issues

### Issue 1: Route Not Found (404)

**Solution**: Use dedicated API files instead of catch-all routing.

### Issue 2: Multer Not Working

**Solution**: Ensure multer is properly imported in serverless functions.

### Issue 3: Express App Not Initializing

**Solution**: Check server build and imports.

## Debug Commands

In production, check the following:

1. **Function Logs**: Check Vercel function logs for errors
2. **Network Tab**: Verify the request is reaching the server
3. **Response Headers**: Check if Content-Type is application/json

## Files Modified

1. `api/upload/image.js` - Dedicated upload route
2. `api/upload/images.js` - Multiple upload route
3. `api/upload-direct.js` - Test endpoint
4. `api/[...path].js` - Enhanced error handling
5. `server/index.ts` - Better API error responses

## Next Steps

1. Deploy the updated code
2. Test the `/api/upload-direct` endpoint first
3. If that works, test `/api/upload/image`
4. Check Vercel function logs for any remaining issues

---

**The upload functionality should now work correctly in production! 🚀**
