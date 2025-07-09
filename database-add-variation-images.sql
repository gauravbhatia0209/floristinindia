-- Add image_url field to product_variants table
DO $$ 
BEGIN
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'image_url') THEN
        ALTER TABLE product_variants ADD COLUMN image_url TEXT;
        COMMENT ON COLUMN product_variants.image_url IS 'URL of variation-specific image, overrides main product image when selected';
    END IF;
END $$;

-- Update existing variations to have null image_url initially
UPDATE product_variants SET image_url = NULL WHERE image_url IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_product_variants_image_url ON product_variants(image_url) WHERE image_url IS NOT NULL;
