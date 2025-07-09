# Product Variations System

## Overview

This document outlines the comprehensive product variations system that allows products to have multiple variations like size, color, weight, etc., with individual pricing, images, and stock management.

## Features Implemented

### 1. Database Schema Enhancement

#### Enhanced `product_variants` Table

- **variation_type**: Category of variation (e.g., "Size", "Color", "Weight")
- **variation_value**: Specific value (e.g., "Small", "Red", "500g")
- **price_override**: Optional custom price (uses base product price if null)
- **sale_price_override**: Optional custom sale price
- **image_url**: Variation-specific image (uses main product image if null)
- **weight, length, width, height**: Physical dimensions
- **display_order**: Custom ordering within variation type

#### New Tables

- **product_variation_combinations**: For complex multi-attribute variations
- **product_variation_combination_items**: Junction table for combination items

### 2. Admin Panel Features

#### ProductVariations Component (`client/components/admin/ProductVariations.tsx`)

- **Drag & Drop Sorting**: Reorder variations within each type
- **Variation Groups**: Organize by type (Size, Color, etc.)
- **Add/Edit/Delete**: Complete CRUD operations
- **Price Override**: Optional custom pricing per variation
- **Image Upload**: Variation-specific images
- **Stock Management**: Individual stock levels per variation
- **Common Types**: Predefined variation types (Size, Color, Weight, etc.)

#### Integration with ProductEdit

- Appears after basic product details are saved
- Inherits base price from main product
- Real-time updates and validation

### 3. Frontend Customer Experience

#### ProductVariationSelector Component (`client/components/ProductVariationSelector.tsx`)

- **Visual Selection**: Button-based variation picker
- **Price Display**: Shows price changes when variations are selected
- **Image Updates**: Dynamically switches product image
- **Stock Status**: Shows "Out of Stock" for unavailable variations
- **Multi-Group Support**: Handles multiple variation types simultaneously
- **Selection Summary**: Shows all selected options

#### ProductDetail Page Updates

- **Dynamic Pricing**: Updates based on selected variations
- **Image Switching**: Main product image updates with variation selection
- **Enhanced Cart Integration**: Includes variation details in cart

### 4. Cart & Checkout Integration

#### Enhanced Cart Display

- **Variation Details**: Shows selected variation information
- **Variation Images**: Uses variation-specific images when available
- **Pricing Logic**: Handles price overrides correctly
- **SKU Display**: Shows variation-specific SKUs

#### CartItem Updates

- **Combined Variant**: Creates comprehensive variant representation
- **Multiple Variations**: Supports products with multiple variation types
- **Backward Compatibility**: Works with existing cart logic

## Database Migration

### Apply Migration

```bash
node apply-variations-migration.js
```

### Migration Features

- **Non-destructive**: Preserves existing data
- **Automatic Migration**: Converts existing variants to new structure
- **Sample Data**: Adds example variations for testing
- **Index Creation**: Optimizes database performance

## Technical Implementation

### 1. Variation Types

The system supports common variation types:

- Size (Small, Medium, Large)
- Color (Red, Blue, Green)
- Weight (500g, 1kg, 2kg)
- Style (Classic, Modern, Premium)
- Material (Wood, Metal, Plastic)
- Packaging (Standard, Gift Box, Eco-Friendly)
- Occasion (Birthday, Anniversary, Wedding)

### 2. Pricing Logic

```typescript
// Pricing hierarchy (highest priority first):
1. variation.sale_price_override (if < price_override)
2. variation.price_override
3. product.sale_price (if < product.price)
4. product.price
```

### 3. Image Logic

```typescript
// Image hierarchy:
1. variation.image_url
2. product.images[0]
3. Fallback placeholder
```

### 4. Stock Management

- Individual stock tracking per variation
- "Out of Stock" display for unavailable variations
- Automatic stock validation during checkout

## API Endpoints

### Fetch Product Variations

```typescript
const { data: variants } = await supabase
  .from("product_variants")
  .select("*")
  .eq("product_id", productId)
  .eq("is_active", true)
  .order("display_order");
```

### Create/Update Variation

```typescript
const { error } = await supabase.from("product_variants").upsert({
  product_id,
  variation_type,
  variation_value,
  price_override,
  sale_price_override,
  image_url,
  stock_quantity,
  is_active,
});
```

## Usage Examples

### Admin Panel

1. Navigate to product edit page
2. Scroll to "Product Variations" section
3. Click "Add Variation"
4. Select variation type (e.g., "Size")
5. Enter variation value (e.g., "Large")
6. Set optional price override
7. Upload optional variation image
8. Set stock quantity
9. Save variation

### Customer Frontend

1. Visit product detail page
2. See variation groups (Size, Color, etc.)
3. Click desired variations
4. Watch price and image update
5. Add to cart with selected variations
6. View variation details in cart

## Benefits

### For Store Owners

- **Flexible Pricing**: Different prices for different variations
- **Visual Merchandising**: Variation-specific images
- **Inventory Control**: Track stock per variation
- **Easy Management**: Intuitive admin interface

### For Customers

- **Clear Options**: Visual variation selection
- **Transparent Pricing**: Price updates in real-time
- **Better Experience**: See exactly what they're buying
- **Informed Decisions**: All variation details visible

## Future Enhancements

### Planned Features

- **Bulk Import**: CSV-based variation upload
- **Variation Sets**: Templates for common variation patterns
- **Advanced Combinations**: Complex multi-attribute pricing
- **Inventory Alerts**: Low stock notifications per variation
- **Analytics**: Variation performance tracking

### Extensibility

- Support for custom variation types
- Integration with external inventory systems
- Advanced pricing rules (quantity breaks, etc.)
- Variation-based shipping calculations

## Testing

### Test Scenarios

1. **Single Variation Type**: Product with only size variations
2. **Multiple Types**: Product with size and color variations
3. **Price Overrides**: Variations with custom pricing
4. **Image Variations**: Variations with specific images
5. **Stock Management**: Out-of-stock variations
6. **Cart Integration**: Adding varied products to cart

### Sample Data

The migration includes sample variations for testing:

- Rose bouquet with size variations (Small, Medium, Large)
- Color variations (Red, Pink, White, Yellow)
- Lily arrangement with premium tiers

## Support

For issues or questions about the product variations system:

1. Check database migration was applied successfully
2. Verify variation data in admin panel
3. Test frontend variation selection
4. Review cart integration with selected variations

The system is designed to be robust, flexible, and user-friendly for both administrators and customers.
