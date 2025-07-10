# Multi-Category Setup Instructions

This guide explains how to enable multi-category support for products in your florist application.

## Database Migration Required

Before using the multi-category features, you need to run the database migration to create the necessary tables.

### Step 1: Apply Database Migration

1. **Go to your Supabase Dashboard**

   - Navigate to your project's Supabase dashboard
   - Go to the SQL Editor

2. **Run the Migration Script**
   - Copy the contents of `database-multi-category-migration.sql`
   - Paste it into the SQL Editor
   - Execute the script

### Step 2: Verify Migration

After running the migration, verify that the following was created:

1. **New Table**: `product_category_assignments`

   - Junction table for many-to-many product-category relationships
   - Includes `is_primary` flag for backwards compatibility

2. **New View**: `products_with_categories`

   - Provides easy access to products with their categories as JSON

3. **Existing Data Migration**
   - All existing product categories have been migrated to the new system
   - Existing `category_id` values are preserved as primary categories

## Features Enabled

### Admin Panel

- **Multi-Category Selection**: Product edit form now allows selecting multiple categories
- **Primary Category**: One category can be marked as primary (used for main classification)
- **Visual Interface**: Easy-to-use checkbox interface with search functionality

### Frontend

- **Category Filtering**: Products appear in all assigned categories
- **Search Compatibility**: Products are found when searching within any assigned category
- **Backwards Compatibility**: Legacy single-category products continue to work

## Usage

### Creating/Editing Products

1. Navigate to Admin → Products → Add/Edit Product
2. In the Categories section, you'll see the new multi-category selector
3. Select one or more categories for the product
4. Click any selected category to make it the primary category
5. Save the product

### Frontend Behavior

- Products will appear in all assigned category pages
- Filters will include products assigned to selected categories
- Search results will include products from all relevant categories

## Migration Details

### What the Migration Does

1. **Creates Junction Table**: `product_category_assignments`
2. **Preserves Existing Data**: Migrates current category assignments
3. **Adds Backwards Compatibility**: Maintains `category_id` field
4. **Creates Helper Functions**: Utilities for querying multi-category data

### Data Structure

```sql
-- New junction table
product_category_assignments
├── id (UUID, Primary Key)
├── product_id (UUID, Foreign Key to products)
├── category_id (UUID, Foreign Key to product_categories)
├── is_primary (Boolean, marks primary category)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

### Backwards Compatibility

- The original `products.category_id` field is preserved
- It's automatically set to the primary category for compatibility
- Existing API endpoints continue to work
- Legacy queries fall back gracefully

## Technical Notes

### Database Queries

The system intelligently handles both new and legacy data:

- Tries multi-category assignments first
- Falls back to single category if no assignments exist
- Maintains performance with proper indexing

### Performance Considerations

- Junction table includes optimized indexes
- View provides efficient category lookup
- Queries are designed to minimize database load

## Troubleshooting

### Migration Issues

If the migration fails:

1. Check Supabase dashboard logs
2. Ensure you have proper permissions
3. Run sections of the migration individually if needed

### Data Integrity

After migration, verify:

- All products have at least one category assignment
- Primary categories are correctly set
- No orphaned category assignments exist

### Rollback (if needed)

To rollback the migration:

1. The original `category_id` field is preserved
2. Simply stop using the new multi-category features
3. Remove the junction table if desired (optional)

## Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check Supabase logs for database errors
3. Verify the migration completed successfully
4. Ensure all required files are present in the project
