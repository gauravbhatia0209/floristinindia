# Hero Section Redesign Documentation

## Overview

The hero section has been completely redesigned with a fixed height and fully dynamic content management through the admin panel. All elements including background images, text, and CTAs are now editable.

## Design Specifications

### Fixed Dimensions

- **Desktop**: `min-h-[500px]` (500px minimum height)
- **Mobile**: `min-h-[450px]` (450px minimum height)
- **Layout**: Centered content with flexbox alignment
- **Responsive**: Automatically adapts to all screen sizes

### Visual Design

- **Background**: Dynamic uploadable background image with gradient overlay
- **Text Color**: White text with dark overlay for optimal readability
- **Animations**: Smooth entrance animations with staggered timing
- **Decorative Elements**: Subtle floating elements for visual appeal

## Admin Panel Features

### ✅ Editable Content Fields

#### 1. **Heading** (Section Title)

- **Field**: Title input
- **Usage**: Main hero heading
- **Example**: "Fresh Flowers"
- **Styling**: Large, bold font (3xl-6xl responsive)

#### 2. **Subheading** (Section Subtitle)

- **Field**: Subtitle input
- **Usage**: Secondary heading in peach color
- **Example**: "Delivered Daily"
- **Styling**: Medium font with peach accent color

#### 3. **Description Text**

- **Field**: Description textarea
- **Usage**: Supporting text below headings
- **Example**: "Experience the joy of premium flower delivery..."
- **Styling**: Gray-100 color, max-width container

#### 4. **Primary CTA Button**

- **Fields**:
  - Button Text input ("Shop Now")
  - Button URL input ("/products")
- **Styling**: Secondary variant with shadow effects
- **Features**: Hover animations and scale effects

#### 5. **Secondary CTA Button (Optional)**

- **Fields**:
  - Secondary Button Text input ("Learn More")
  - Secondary Button URL input ("/about")
- **Styling**: Outline variant with white border
- **Display**: Only shows if text is provided

#### 6. **Background Image**

- **Field**: Image upload component
- **Storage**: `/public/uploads/hero/` directory
- **Requirements**:
  - Max file size: 5MB
  - Accepted formats: PNG, WebP, JPG, JPEG
  - Recommended: High-quality landscape images
- **Fallback**: Default gradient background if no image

### Admin Panel Interface

```typescript
// Hero Section Content Structure
{
  "description": "Your compelling description text",
  "button_text": "Shop Now",
  "button_link": "/products",
  "secondary_button_text": "Learn More", // Optional
  "secondary_button_link": "/about",     // Optional
  "background_image": "/uploads/hero/1640995200000-a1b2c3-hero-bg.jpg"
}
```

## Technical Implementation

### Frontend Rendering

#### Responsive Design

```jsx
<section className="relative min-h-[450px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
  {/* Background with dynamic image */}
  <div
    style={{
      backgroundImage: backgroundImage
        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`
        : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />

  {/* Content with animations */}
  <div className="container relative z-20 text-center text-white">
    {/* Dynamic content here */}
  </div>
</section>
```

#### Animation Classes

- `animate-entrance`: Smooth entrance animation (1.2s duration)
- Staggered delays: 0s, 0.2s, 0.4s, 0.6s for progressive reveal
- `hover:scale-105`: Button hover effects

### File Upload Integration

#### Background Image Upload

- **Component**: `SingleImageUpload`
- **Subdirectory**: `hero`
- **Max Size**: 5MB (larger than decorative images)
- **Validation**: Automatic file type and size validation
- **Preview**: Real-time thumbnail in admin panel

#### Storage Structure

```
public/
└── uploads/
    └── hero/
        ├── 1640995200000-a1b2c3-hero-background.jpg
        ├── 1640995201000-d4e5f6-hero-image.png
        └── ...
```

## Mobile Responsiveness

### Breakpoint Adaptations

#### Mobile (< 768px)

- Height: 450px minimum
- Font sizes: `text-3xl` for heading
- Buttons: Stack vertically (`flex-col`)
- Padding: Reduced spacing

#### Tablet (768px - 1024px)

- Height: 500px minimum
- Font sizes: `text-5xl` for heading
- Buttons: Horizontal layout (`flex-row`)

#### Desktop (≥ 1024px)

- Height: 500px minimum
- Font sizes: `text-6xl` for heading
- Full decorative effects visible

### Content Stacking

```css
/* Mobile-first approach */
.hero-content {
  @apply flex flex-col gap-6;
}

/* Tablet and up */
@screen md {
  .hero-content {
    @apply gap-8;
  }
}
```

## Design Guidelines

### Background Image Recommendations

#### Image Specifications

- **Resolution**: Minimum 1920x1080px (Full HD)
- **Aspect Ratio**: 16:9 or 21:9 (landscape)
- **File Size**: Under 2MB for optimal loading
- **Format**: WebP recommended, JPG/PNG acceptable

#### Content Guidelines

- **Subject**: Flowers, nature, or brand-related imagery
- **Composition**: Leave center space for text overlay
- **Colors**: Warm, complementary colors that work with white text
- **Contrast**: Ensure good contrast for text readability

### Typography Hierarchy

1. **Main Heading**: Largest, most prominent
2. **Subheading**: Medium, accent color (peach)
3. **Description**: Smaller, supporting text
4. **Buttons**: Call-to-action prominence

### Color Scheme

- **Text**: White (`text-white`)
- **Accent**: Peach (`text-peach`)
- **Description**: Light gray (`text-gray-100`)
- **Overlay**: Dark semi-transparent (`bg-black/30`)

## Performance Considerations

### Image Optimization

- **Lazy Loading**: Background images load immediately for hero
- **Compression**: Recommend image compression before upload
- **Formats**: WebP preferred for smaller file sizes
- **Fallback**: Gradient background ensures fast initial render

### Animation Performance

- **Hardware Acceleration**: CSS transforms use GPU acceleration
- **Staggered Loading**: Prevents animation overload
- **Reduced Motion**: Respects user accessibility preferences

### Loading Strategy

1. **Critical CSS**: Hero styles loaded immediately
2. **Background Image**: Progressive enhancement
3. **Animations**: Triggered after content load
4. **Fallbacks**: Graceful degradation for slow connections

## Usage Examples

### Business Homepage

```json
{
  "title": "Premium Flower Delivery",
  "subtitle": "Fresh Blooms Daily",
  "description": "Transform any moment into something special with our handpicked flowers, delivered fresh to your door.",
  "button_text": "Shop Flowers",
  "button_link": "/flowers",
  "secondary_button_text": "View Gallery",
  "secondary_button_link": "/gallery",
  "background_image": "/uploads/hero/flower-field-bg.jpg"
}
```

### Seasonal Campaign

```json
{
  "title": "Valentine's Day Special",
  "subtitle": "Express Your Love",
  "description": "Surprise your loved one with our exclusive Valentine's collection.",
  "button_text": "Shop Valentine's",
  "button_link": "/valentines",
  "background_image": "/uploads/hero/valentines-roses-bg.jpg"
}
```

## Troubleshooting

### Common Issues

1. **Background Image Not Displaying**

   - Check file upload success in admin panel
   - Verify image URL in database
   - Ensure file exists in `/public/uploads/hero/`
   - Check image file size (must be under 5MB)

2. **Text Not Readable**

   - Increase overlay opacity (`bg-black/40` instead of `/30`)
   - Choose background images with better contrast
   - Ensure dark overlay is applied

3. **Mobile Layout Issues**

   - Verify responsive classes are applied
   - Test on various screen sizes
   - Check button stacking on mobile

4. **Animation Problems**
   - Clear browser cache
   - Check CSS animation definitions
   - Verify entrance animation timing

### Best Practices

1. **Content Strategy**

   - Keep headlines concise and impactful
   - Use action-oriented button text
   - Test different background images

2. **Performance**

   - Optimize images before upload
   - Use WebP format when possible
   - Monitor loading times

3. **Accessibility**

   - Ensure sufficient color contrast
   - Provide meaningful alt text
   - Test with screen readers

4. **SEO Considerations**
   - Use descriptive, keyword-rich headlines
   - Optimize image file names
   - Ensure fast loading times

This redesigned hero section provides a powerful, flexible foundation for creating compelling homepage experiences while maintaining excellent performance and user experience across all devices.
