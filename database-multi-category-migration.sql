-- Multi-Category Support Migration
-- Adds support for products to belong to multiple categories

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create product_category_assignments junction table
CREATE TABLE IF NOT EXISTS product_category_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure unique product-category pairs
    UNIQUE(product_id, category_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_category_assignments_product_id ON product_category_assignments(product_id);
CREATE INDEX IF NOT EXISTS idx_product_category_assignments_category_id ON product_category_assignments(category_id);
CREATE INDEX IF NOT EXISTS idx_product_category_assignments_primary ON product_category_assignments(is_primary) WHERE is_primary = TRUE;

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_category_assignments_updated_at
    BEFORE UPDATE ON product_category_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migrate existing product-category relationships
-- This will preserve existing single category assignments by marking them as primary
INSERT INTO product_category_assignments (product_id, category_id, is_primary)
SELECT id, category_id, TRUE
FROM products
WHERE category_id IS NOT NULL
ON CONFLICT (product_id, category_id) DO NOTHING;

-- Create view for easy querying of products with their categories
CREATE OR REPLACE VIEW products_with_categories AS
SELECT
    p.*,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', pc.id,
                'name', pc.name,
                'slug', pc.slug,
                'is_primary', pca.is_primary
            ) ORDER BY pca.is_primary DESC, pc.name
        ) FILTER (WHERE pc.id IS NOT NULL),
        '[]'::json
    ) as categories
FROM products p
LEFT JOIN product_category_assignments pca ON p.id = pca.product_id
LEFT JOIN product_categories pc ON pca.category_id = pc.id AND pc.is_active = TRUE
GROUP BY p.id;

-- Grant necessary permissions
GRANT ALL ON product_category_assignments TO authenticated;
GRANT SELECT ON products_with_categories TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE product_category_assignments IS 'Junction table for many-to-many relationship between products and categories';
COMMENT ON COLUMN product_category_assignments.is_primary IS 'Indicates if this is the primary category for the product (used for backwards compatibility)';
COMMENT ON VIEW products_with_categories IS 'View that includes products with their assigned categories as JSON';

-- Optional: Add function to get primary category for backwards compatibility
CREATE OR REPLACE FUNCTION get_primary_category_id(product_uuid UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT category_id
        FROM product_category_assignments
        WHERE product_id = product_uuid AND is_primary = TRUE
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_primary_category_id IS 'Returns the primary category ID for a product (backwards compatibility)';
