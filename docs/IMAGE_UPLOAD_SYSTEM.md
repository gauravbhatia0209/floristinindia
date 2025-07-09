# Image Upload System Documentation

## Overview

This document describes the comprehensive image upload system implemented for the admin panel, replacing manual URL entry with secure file uploads.

## Features

### ✅ Frontend Components

#### 1. **ImageUpload Component** (`client/components/ui/image-upload.tsx`)

- **Purpose**: Multi-image upload for products (up to 5 images)
- **Features**:
  - Drag & drop support
  - Image preview with thumbnails
  - Upload progress indicators
  - Primary image designation (first image)
  - Individual image removal
  - Error handling and retry functionality
  - File validation (type, size)

#### 2. **SingleImageUpload Component** (`client/components/ui/single-image-upload.tsx`)

- **Purpose**: Single image upload for categories
- **Features**:
  - Click to upload interface
  - Image preview with replace/remove options
  - Upload progress indication
  - Error handling
  - File validation

### ✅ Backend Implementation

#### 1. **Upload API** (`server/routes/upload.ts`)

- **Endpoints**:
  - `POST /api/upload/image` - Single image upload
  - `POST /api/upload/images` - Multiple image upload
  - `DELETE /api/upload/image/:filename` - Delete image

#### 2. **Security Features**:

- File type validation (`.jpg`, `.jpeg`, `.png`, `.webp`)
- File size limits (3MB per file)
- Filename sanitization
- Unique filename generation (timestamp + random string)
- Upload count limits (max 5 files)

### ✅ Database Integration

#### 1. **Product Images**

```typescript
// Database field: images (string[])
"images": [
  "/uploads/1640995200000-a1b2c3-product-image.jpg",
  "/uploads/1640995201000-d4e5f6-product-detail.jpg"
]
```

#### 2. **Category Images**

```typescript
// Database field: image_url (string)
"image_url": "/uploads/1640995200000-a1b2c3-category-banner.jpg"
```

## Implementation Details

### File Storage Structure

```
public/
└── uploads/
    ├── .gitkeep
    ├── 1640995200000-a1b2c3-product-image.jpg
    ├���─ 1640995201000-d4e5f6-category-banner.jpg
    └── ...
```

### Validation Rules

#### File Types

- `.jpg`, `.jpeg` - JPEG images
- `.png` - PNG images
- `.webp` - WebP images

#### Size Limits

- **Maximum file size**: 3MB per file
- **Maximum files**: 5 images per product
- **Category**: 1 image per category

#### Filename Sanitization

- Original: `My Product Image!@#.jpg`
- Sanitized: `1640995200000-a1b2c3-My-Product-Image.jpg`

### Error Handling

#### Frontend

- File validation errors
- Upload progress indication
- Network error handling
- Image loading error fallbacks
- Retry functionality for failed uploads

#### Backend

- Multer error handling
- File system error handling
- Proper HTTP status codes
- Detailed error messages

## Usage Guide

### For Products (Admin Panel)

1. **Navigate to**: `/admin/products/new` or `/admin/products/edit/:id`
2. **Upload Images**:
   - Click "Upload Images" button
   - Select up to 5 images (3MB each max)
   - Preview images appear instantly
   - First image is marked as "Primary"
3. **Manage Images**:
   - Hover over image to see Remove button
   - Click X to remove unwanted images
   - Images are automatically saved to database on form submission

### For Categories (Admin Panel)

1. **Navigate to**: `/admin/categories`
2. **Upload Image**:
   - Click the dashed upload area
   - Select single image (3MB max)
   - Image preview appears
3. **Replace/Remove**:
   - Hover over uploaded image
   - Click "Replace" to upload new image
   - Click X to remove image

## API Endpoints

### Upload Single Image

```http
POST /api/upload/image
Content-Type: multipart/form-data

{
  "image": <file>
}
```

**Response:**

```json
{
  "success": true,
  "imageUrl": "/uploads/1640995200000-a1b2c3-filename.jpg",
  "filename": "1640995200000-a1b2c3-filename.jpg",
  "originalName": "original-filename.jpg",
  "size": 1234567
}
```

### Upload Multiple Images

```http
POST /api/upload/images
Content-Type: multipart/form-data

{
  "images": [<file1>, <file2>, ...]
}
```

### Delete Image

```http
DELETE /api/upload/image/:filename
```

## Error Responses

### Validation Errors

```json
{
  "error": "File size must be less than 3MB"
}
```

```json
{
  "error": "File type .gif not allowed. Use: .jpg, .jpeg, .png, .webp"
}
```

### Upload Errors

```json
{
  "error": "Too many files. Maximum is 5 images."
}
```

## Frontend Integration

### Product Component Usage

```tsx
import { ImageUpload } from "@/components/ui/image-upload";

<ImageUpload
  images={formData.images}
  onImagesChange={(images) => setFormData({ ...formData, images })}
  maxImages={5}
  maxSizeMB={3}
  label="Product Images"
/>;
```

### Category Component Usage

```tsx
import { SingleImageUpload } from "@/components/ui/single-image-upload";

<SingleImageUpload
  imageUrl={formData.image_url}
  onImageChange={(imageUrl) =>
    setFormData({ ...formData, image_url: imageUrl })
  }
  label="Category Image"
/>;
```

## Security Considerations

1. **File Type Validation**: Only approved image formats
2. **Size Limits**: Prevents large file uploads
3. **Filename Sanitization**: Prevents directory traversal
4. **Unique Filenames**: Prevents overwrites and conflicts
5. **Server-side Validation**: Backend validates all uploads
6. **Error Handling**: Graceful failure handling

## Performance Optimizations

1. **Progressive Upload**: Real-time preview during upload
2. **Error Recovery**: Retry failed uploads
3. **Cleanup**: Automatic deletion of replaced images
4. **Lazy Loading**: Images load on demand
5. **Compression**: Recommend image optimization before upload

## Troubleshooting

### Common Issues

1. **Upload Fails**:

   - Check file size (must be < 3MB)
   - Verify file type (jpg, jpeg, png, webp only)
   - Check network connection

2. **Image Not Displaying**:

   - Verify image URL in database
   - Check if file exists in `/public/uploads/`
   - Ensure proper server static file serving

3. **Delete Not Working**:
   - Check file permissions
   - Verify filename in request
   - Check server logs for errors

### Development Setup

1. **Dependencies**: `npm install multer @types/multer`
2. **Directory**: Ensure `public/uploads/` exists
3. **Server**: Upload routes must be registered
4. **Static Files**: Express must serve static files from uploads

## Future Enhancements

1. **Cloud Storage**: Integrate with AWS S3, Cloudinary, etc.
2. **Image Processing**: Automatic resizing, optimization
3. **CDN Integration**: Serve images from CDN
4. **Bulk Upload**: Multiple file selection improvements
5. **Image Editing**: Basic crop/resize functionality
6. **Progressive Web App**: Offline upload queue
