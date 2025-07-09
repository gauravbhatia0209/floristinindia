# Product Variations Toggle Feature

## Overview

This feature adds a toggle control to enable/disable variations for individual products. Products can now be either:

- **Simple products**: Standard pricing, stock, and display
- **Variable products**: Full variation management with multiple options

## Database Changes Required

### SQL Migration

Run the following SQL commands to add the `has_variations` field:

```sql
-- Add has_variations field to products table
ALTER TABLE products ADD COLUMN has_variations BOOLEAN DEFAULT false;

-- Update the column to be NOT NULL with default false
ALTER TABLE products ALTER COLUMN has_variations SET NOT NULL;
ALTER TABLE products ALTER COLUMN has_variations SET DEFAULT false;

-- Update existing products that have variants to set has_variations = true
UPDATE products
SET has_variations = true
WHERE id IN (
  SELECT DISTINCT product_id
  FROM product_variants
  WHERE is_active = true
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_products_has_variations ON products(has_variations);
```

## Admin Interface Changes

### Product Edit Form

- Added "Does this product have variations?" toggle in the admin panel
- When **OFF**: Shows only basic product fields (price, stock, etc.)
- When **ON**: Shows full variation management interface
- Located between "Pricing & Inventory" and "Images" sections

### Behavior

- **New products**: Toggle defaults to OFF (simple product)
- **Existing products**: Toggle reflects current variation status
- **Switching modes**: Toggle immediately shows/hides variation management

## Frontend Changes

### Product Display

- **Simple products**: Display price, stock status, and basic add-to-cart
- **Variable products**: Show variation selector with options
- Maintains all existing cart compatibility

### Simple Product Layout

- Clear pricing display with sale price support
- Stock status indicator
- Percentage discount badges
- Standard quantity selector

### Variable Product Layout

- Full variation selector interface
- Dynamic pricing based on selected variations
- Variation-specific images and stock

## Compatibility

### Cart System

- Fully compatible with existing cart functionality
- Simple products use base product data
- Variable products use selected variation data

### Pricing System

- Simple products use `product.price` and `product.sale_price`
- Variable products use variation pricing with overrides
- All existing pricing logic preserved

### Stock Management

- Simple products use `product.stock_quantity`
- Variable products use `variant.stock_quantity`
- Stock validation works for both types

## Usage Guidelines

### When to Use Simple Products

- Single pricing option
- No size/color variations
- Straightforward inventory management

### When to Use Variable Products

- Multiple size options
- Different colors or styles
- Varying prices based on options
- Complex inventory tracking

## Migration Notes

- Existing products with active variants automatically get `has_variations = true`
- Products without variants remain as simple products
- No data loss during migration
- Backward compatibility maintained
