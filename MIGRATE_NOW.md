# 🚀 Quick Migration to Supabase Storage

## What This Does

Migrates ALL static media assets (product images, hero images, etc.) from local `/uploads/` storage to Supabase Storage public bucket `media-assets`.

## Prerequisites ✅

Make sure you have these environment variables set:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Migration Steps

### 1. Set Up Storage Bucket

```bash
npm run setup-supabase-bucket
```

### 2. Run Migration

```bash
npm run migrate-media
```

### 3. Deploy Updated Code

```bash
npm run build
# Deploy to your hosting platform
```

## What Happens

1. **Creates `media-assets` bucket** in Supabase Storage (public access)

2. **Uploads all images** from:

   - `/uploads/` directory
   - `/public/uploads/` directory
   - Subdirectories like `/hero/`, `/hero-carousel/`

3. **Updates database** automatically:

   - Products table (`images`, `image_url`)
   - Categories table (`image_url`)
   - Homepage sections (`content` JSON)

4. **Creates URL mapping** in `supabase-url-mapping.json`

5. **Updates upload system** to use Supabase Storage for new uploads

## Results

- ✅ All existing images moved to cloud storage
- ✅ All new uploads go to Supabase Storage
- ✅ No more file loss during deployments
- ✅ Global CDN delivery
- ✅ No `/vercel.json` needed for static files

## Files Changed

- `server/routes/upload.ts` - Now uses Supabase Storage exclusively
- `client/lib/image-utils.ts` - New image handling utilities
- Database records updated with new URLs

## After Migration

Your images will be served from URLs like:

```
https://your-project.supabase.co/storage/v1/object/public/media-assets/uploads/filename.webp
```

Instead of:

```
/uploads/filename.webp
```

---

**Ready to migrate? Run:**

```bash
npm run setup-supabase-bucket && npm run migrate-media
```
