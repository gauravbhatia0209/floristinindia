# Supabase Media Storage Migration Guide

This guide will help you migrate all static media assets from local `/uploads/` storage to Supabase Storage.

## Prerequisites

1. **Supabase Project**: You must have a Supabase project set up
2. **Environment Variables**: Ensure these are set in your environment:
   ```bash
   VITE_SUPABASE_URL=your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Step 1: Set Up Supabase Storage Bucket

First, create the required storage bucket:

```bash
# Set up the media-assets bucket
node scripts/setup-supabase-bucket.js
```

This will:

- Create a public `media-assets` bucket in Supabase Storage
- Configure appropriate MIME types and file size limits
- Verify bucket access

## Step 2: Run the Migration

Execute the migration script to upload all existing media:

```bash
# Run the complete migration
npm run migrate-media
```

Or run a dry-run first to see what will be migrated:

```bash
# Dry run (shows what would be migrated without uploading)
npm run migrate-media:dry-run
```

## What the Migration Does

### 1. **File Upload**

- Scans `uploads/` and `public/uploads/` directories
- Uploads all image files (JPG, PNG, WebP, GIF, SVG) to Supabase Storage
- Generates unique filenames to prevent conflicts
- Creates public URLs for all uploaded files

### 2. **Database Updates**

- Updates `products` table: `images` array and `image_url` fields
- Updates `product_categories` table: `image_url` fields
- Updates `homepage_sections` table: any image URLs in `content` JSON
- Replaces all `/uploads/` URLs with Supabase Storage URLs

### 3. **URL Mapping**

- Creates `supabase-url-mapping.json` with complete mapping
- Maps old local URLs to new Supabase URLs
- Useful for troubleshooting and rollback if needed

## Step 3: Update Application Code

### Backend Changes (Already Implemented)

- ✅ Upload routes now use Supabase Storage exclusively
- ✅ All new uploads go directly to cloud storage
- ✅ No more local file storage

### Frontend Changes

- ✅ New image utilities in `client/lib/image-utils.ts`
- ✅ Smart image components with fallback handling
- ✅ Automatic URL normalization

### Example Usage in Components

```typescript
import { SmartImage, getBestImageUrl } from '@/lib/image-utils';

// Use SmartImage component for automatic fallback
<SmartImage
  src={product.image_url}
  alt={product.name}
  fallback="/placeholder.svg"
  className="w-full h-48 object-cover"
/>

// Or manually get best URL
const imageUrl = getBestImageUrl(product.image_url);
```

## Step 4: Clean Up (Optional)

After confirming everything works:

```bash
# Remove local uploads directory
rm -rf uploads/
rm -rf public/uploads/

# Update .gitignore to remove upload exclusions
```

## Verification

### Check Migration Results

```bash
# View the URL mapping
cat supabase-url-mapping.json

# Check Supabase Storage bucket
# Go to your Supabase dashboard -> Storage -> media-assets
```

### Test Image Loading

1. Visit your application
2. Check that all product images load correctly
3. Try uploading new images to verify they go to Supabase
4. Check browser network tab - URLs should be `https://your-project.supabase.co/storage/v1/object/public/media-assets/...`

## Benefits

### 🚀 **Performance**

- Images served from Supabase CDN
- Global distribution and caching
- Optimized delivery

### 🔒 **Reliability**

- No file loss during deployments
- Persistent storage independent of application
- Built-in backup and recovery

### 📈 **Scalability**

- No local storage limitations
- Handles high traffic automatically
- Easy to add image optimization

### 🛠 **Maintenance**

- No need to manage local file storage
- Automatic cleanup and organization
- Centralized media management

## Troubleshooting

### Common Issues

**Migration fails with "Bucket not found"**

```bash
# Run bucket setup first
node scripts/setup-supabase-bucket.js
```

**"Permission denied" errors**

- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check bucket permissions in Supabase dashboard

**Images not loading after migration**

- Check the URL mapping file: `supabase-url-mapping.json`
- Verify database was updated correctly
- Check browser console for specific error messages

### Rollback (if needed)

If you need to rollback:

1. Use the URL mapping file to reverse changes
2. Run a custom script to update database URLs back to `/uploads/`
3. Restore local files from backup

## File Structure After Migration

```
├── scripts/
│   ├── migrate-to-supabase-storage.js    # Main migration script
│   └── setup-supabase-bucket.js          # Bucket setup script
├── client/lib/
│   └── image-utils.ts                     # Frontend image utilities
├── supabase-url-mapping.json             # URL mapping (generated)
└── server/routes/
    └── upload.ts                          # Updated to use Supabase Storage
```

## Next Steps

1. **Image Optimization**: Consider adding image transformation features
2. **CDN Configuration**: Set up custom domain for images if needed
3. **Monitoring**: Set up alerts for storage usage and errors
4. **Backup Strategy**: Configure automatic backups in Supabase

---

**Need Help?**

- Check Supabase Storage documentation
- Review the generated URL mapping file
- Check application logs for specific error messages
