# Hero Right Image Upload Feature

## Overview

This feature allows administrators to upload a decorative image that appears on the right side of the hero section on the homepage.

## Admin Panel Usage

### 1. Accessing the Feature

1. **Navigate to**: `/admin/homepage`
2. **Find the Hero Section**: Look for the hero banner section in the homepage builder
3. **Click Edit**: Click the edit button on the hero section

### 2. Uploading the Right Side Image

1. **Locate the Upload Field**: Look for "Right Side Image" field in the hero section edit form
2. **Upload Image**:
   - Click the dashed upload area
   - Select an image file (PNG, WebP, JPG, JPEG only)
   - Maximum file size: 3MB
3. **Preview**: The uploaded image will appear as a thumbnail preview
4. **Replace/Remove**:
   - Hover over the uploaded image to see Replace and Remove options
   - Click "Replace" to upload a new image
   - Click "X" to remove the current image

### 3. Saving Changes

1. **Save Section**: Click "Save Changes" to save the hero section
2. **View Frontend**: The image will appear on the homepage hero section

## Frontend Display

### Image Positioning

The uploaded image is displayed with the following characteristics:

- **Position**: Absolute positioned on the right side of the hero section
- **Location**: `right-8 top-8` (32px from right and top edges)
- **Size**: `w-40` (160px width), height is auto-calculated
- **Responsive**: Hidden on mobile devices (`hidden md:block`)
- **Layer**: Above background but below text content (`z-10`)
- **Opacity**: Slightly transparent (`opacity-90`)
- **Pointer Events**: Disabled (`pointer-events-none`)

### CSS Styling

```css
.hero-right-image {
  position: absolute;
  right: 2rem;
  top: 2rem;
  width: 10rem;
  height: auto;
  pointer-events: none;
  z-index: 10;
  opacity: 0.9;
  object-fit: contain;
}

/* Hidden on mobile */
@media (max-width: 768px) {
  .hero-right-image {
    display: none;
  }
}
```

## Technical Implementation

### File Storage

- **Directory**: `/public/uploads/hero/`
- **Filename Format**: `timestamp-randomhash-sanitizedname.ext`
- **Example**: `1640995200000-a1b2c3-hero-image.png`

### Database Storage

The image URL is stored in the hero section's content:

```json
{
  "type": "hero",
  "content": {
    "description": "Hero description text...",
    "right_image_url": "/uploads/hero/1640995200000-a1b2c3-hero-image.png",
    "button_text": "Shop Now",
    "button_link": "/products"
  }
}
```

### API Endpoints

#### Upload Hero Image

```http
POST /api/upload/image?subdir=hero
Content-Type: multipart/form-data

{
  "image": <file>
}
```

#### Delete Hero Image

```http
DELETE /api/upload/image/:filename?subdir=hero
```

## File Validation

### Accepted File Types

- `.png` - PNG images (recommended for transparency)
- `.webp` - WebP images (modern format)
- `.jpg` - JPEG images
- `.jpeg` - JPEG images

### File Size Limits

- **Maximum Size**: 3MB per file
- **Recommended Size**: 400x400px or smaller for optimal performance

### Transparency Support

- **PNG files**: Full transparency support, perfect for decorative elements
- **WebP files**: Transparency support
- **JPG/JPEG files**: No transparency (solid background)

## Best Practices

### Image Design

1. **Transparent Background**: Use PNG with transparent background for best results
2. **Simple Graphics**: Keep the image simple and not too detailed
3. **Size Optimization**: Compress images before upload for faster loading
4. **Color Scheme**: Ensure the image complements the hero section colors

### Responsive Considerations

1. **Mobile Hidden**: The image is hidden on mobile devices to avoid clutter
2. **Tablet Display**: Image appears on tablet and desktop screens
3. **High DPI**: Consider providing high-resolution images for retina displays

## Troubleshooting

### Common Issues

1. **Image Not Appearing**:

   - Check if the image was uploaded successfully
   - Verify the image URL in the database
   - Ensure the file exists in `/public/uploads/hero/`

2. **Upload Fails**:

   - Check file size (must be under 3MB)
   - Verify file type (PNG, WebP, JPG, JPEG only)
   - Check server logs for detailed errors

3. **Image Quality Issues**:
   - Use high-resolution images (at least 400px width)
   - Ensure proper compression before upload
   - Consider using WebP format for better compression

### Debug Information

The hero section includes error handling that logs to the browser console:

```javascript
console.warn("Hero right image failed to load:", imageUrl);
```

Check the browser console for any image loading errors.

## Example Usage

### Good Image Examples

- Company logo with transparent background
- Decorative floral graphics
- Abstract design elements
- Product silhouettes
- Seasonal decorations

### Recommended Dimensions

- **Width**: 300-500px
- **Height**: 300-500px
- **Aspect Ratio**: Square or portrait orientation works best
- **File Size**: Under 500KB for optimal performance

## Integration with Homepage Builder

The hero image upload is fully integrated with the existing homepage builder system:

1. **Section Management**: Part of the hero section editing interface
2. **Preview System**: Real-time preview in admin panel
3. **Content Management**: Stored in the same content structure as other hero elements
4. **Version Control**: Changes are saved with the rest of the hero section

This feature enhances the visual appeal of the hero section while maintaining the flexibility and ease of use of the homepage builder system.
