-- Product Delivery Zones Migration (Fixed RLS)
-- This table tracks which products are available in which delivery zones and their quantities

BEGIN;

-- Create the product_delivery_zones table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_delivery_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    zone_id UUID NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
    available_quantity INT NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, zone_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_delivery_zones_product_id ON product_delivery_zones(product_id);
CREATE INDEX IF NOT EXISTS idx_product_delivery_zones_zone_id ON product_delivery_zones(zone_id);
CREATE INDEX IF NOT EXISTS idx_product_delivery_zones_product_zone ON product_delivery_zones(product_id, zone_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_delivery_zones_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_product_delivery_zones_timestamp ON product_delivery_zones;
CREATE TRIGGER trigger_update_product_delivery_zones_timestamp
BEFORE UPDATE ON product_delivery_zones
FOR EACH ROW
EXECUTE FUNCTION update_product_delivery_zones_timestamp();

-- Enable RLS
ALTER TABLE product_delivery_zones ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "product_delivery_zones_public_read" ON product_delivery_zones;
DROP POLICY IF EXISTS "product_delivery_zones_admin_write" ON product_delivery_zones;
DROP POLICY IF EXISTS "product_delivery_zones_authenticated_all" ON product_delivery_zones;

-- Policy 1: Anyone can read product delivery zones
CREATE POLICY "product_delivery_zones_public_read" ON product_delivery_zones
    FOR SELECT USING (true);

-- Policy 2: Authenticated users who are admins can do everything
CREATE POLICY "product_delivery_zones_authenticated_write" ON product_delivery_zones
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM sub_users
            WHERE sub_users.id = auth.uid()
            AND sub_users.role = 'admin'
        )
    );

CREATE POLICY "product_delivery_zones_authenticated_update" ON product_delivery_zones
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM sub_users
            WHERE sub_users.id = auth.uid()
            AND sub_users.role = 'admin'
        )
    ) WITH CHECK (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM sub_users
            WHERE sub_users.id = auth.uid()
            AND sub_users.role = 'admin'
        )
    );

CREATE POLICY "product_delivery_zones_authenticated_delete" ON product_delivery_zones
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM sub_users
            WHERE sub_users.id = auth.uid()
            AND sub_users.role = 'admin'
        )
    );

COMMIT;
