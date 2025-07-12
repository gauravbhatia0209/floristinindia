# Supabase Storage Setup & Image Migration Guide

This guide will help you migrate your category images from local storage to Supabase and fix any broken image links.

## Prerequisites

1. **Supabase Project Setup**: Ensure you have a Supabase project with the following environment variables configured in your `.env` file:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Service Role Key**: You'll need the service role key (not just the anon key) for bucket creation and management.

## Step 1: Set Up Supabase Storage Bucket

Run the setup script to create the required storage bucket and policies:

```bash
npm run setup:storage
```

This script will:

- Create a `media-assets` bucket in your Supabase storage
- Set up public read access policies
- Configure authenticated upload/delete policies
- Test the upload functionality

### Manual Setup (if automated setup fails)

If the script fails, you can manually create the bucket in your Supabase dashboard:

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name: `media-assets`
4. Make it **Public**
5. Set **File size limit** to 3MB
6. **Allowed MIME types**: `image/jpeg,image/png,image/webp`

Then add these policies in **Storage > Policies**:

1. **Public read access**:

   - Policy name: `Public read access`
   - Allowed operation: `SELECT`
   - Target roles: `public`
   - Policy definition: `true`

2. **Authenticated uploads**:

   - Policy name: `Authenticated uploads`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
   - Policy definition: `true`

3. **Authenticated deletes**:
   - Policy name: `Authenticated deletes`
   - Allowed operation: `DELETE`
   - Target roles: `authenticated`
   - Policy definition: `true`

## Step 2: Migrate Existing Category Images

1. **Access the Migration Tool**:

   - Log in to your admin panel
   - Go to **Categories** page
   - Click the **"Migrate Images"** button (this opens in a new tab)

2. **Review Image Status**:
   The migration tool will show you:

   - **Broken Images**: URLs that return 404 or are not accessible
   - **Local Images**: Images stored in `/uploads/` that need migration
   - **Migration Needed**: Images that require migration to Supabase

3. **Run Migration**:

   - Click **"Start Migration"** to begin the process
   - The tool will:
     - Download each local image
     - Upload it to Supabase storage
     - Update the database with the new Supabase URL
     - Show progress in real-time

4. **Review Results**:
   - Check the migration results
   - Any failed migrations will be logged with error details
   - Successfully migrated images will now use Supabase URLs

## Step 3: Verify Migration

After migration:

1. **Check Category Images**: Go back to the Categories page and verify all images are loading correctly
2. **Test New Uploads**: Try uploading a new category image to ensure it goes to Supabase
3. **Check URLs**: New image URLs should look like:
   ```
   https://your-project.supabase.co/storage/v1/object/public/media-assets/categories/...
   ```

## Features After Migration

### Automatic Upload to Supabase

- All new image uploads automatically go to Supabase storage
- Images are organized in subdirectories (e.g., `categories/`)
- Unique filenames prevent conflicts

### Validation & Error Handling

- File size validation (max 3MB)
- File type validation (JPEG, PNG, WebP only)
- Broken image detection and alerts
- Automatic retry mechanisms

### Visual Indicators

- ✅ **Green cloud icon**: Image stored in Supabase
- ⚠️ **Orange warning**: Local image (needs migration)
- 🖼️ **Gray icon**: External image URL

### Admin Alerts

- Success notifications when images upload successfully
- Error alerts if uploads fail or images become inaccessible
- Real-time validation of image accessibility

## Troubleshooting

### Upload Failures

- **Check bucket policies**: Ensure authenticated users can upload
- **Verify file size**: Must be under 3MB
- **Check file type**: Only JPEG, PNG, WebP allowed
- **Network issues**: Temporary connectivity problems

### Broken Images After Migration

- **Check Supabase URL**: Ensure the bucket is public
- **Verify policies**: Public read access must be enabled
- **Test manually**: Try accessing the image URL directly

### Service Role Key Issues

- The service role key is required for bucket creation
- Don't confuse it with the anon key
- Keep it secure and don't commit to version control

## Rollback Plan

If you need to rollback to local storage:

1. **Keep the old upload system**: The local upload API endpoints are still available
2. **Revert component changes**: You can modify `SingleImageUpload` to use the old `/api/upload/image` endpoint
3. **Database rollback**: You'd need to manually update image URLs in the database

## Security Considerations

- **Public bucket**: The `media-assets` bucket is public for easy image serving
- **Authenticated uploads**: Only authenticated users can upload new images
- **File validation**: Server-side validation prevents malicious uploads
- **Rate limiting**: Consider adding rate limiting for uploads in production

## Performance Benefits

- **CDN**: Supabase provides global CDN for fast image delivery
- **Scalability**: No server storage limits or management required
- **Reliability**: Automatic backups and high availability
- **Cost**: Pay-as-you-use pricing model

For support or issues, check the Supabase documentation or contact support.
