-- Enhanced Shipping Management System Migration
-- This creates the new structure to support unified shipping method interface

-- 1. Create shipping_method_templates table (for reusable methods)
CREATE TABLE IF NOT EXISTS shipping_method_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('same_day', 'next_day', 'standard', 'express', 'scheduled')),
  rules TEXT, -- Custom rules/notes for the shipping method
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create shipping_method_zone_config table (many-to-many with pricing)
CREATE TABLE IF NOT EXISTS shipping_method_zone_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_template_id UUID REFERENCES shipping_method_templates(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES shipping_zones(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  free_shipping_minimum DECIMAL(10,2),
  delivery_time VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(method_template_id, zone_id)
);

-- 3. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipping_method_zone_config_method ON shipping_method_zone_config(method_template_id);
CREATE INDEX IF NOT EXISTS idx_shipping_method_zone_config_zone ON shipping_method_zone_config(zone_id);
CREATE INDEX IF NOT EXISTS idx_shipping_method_zone_config_active ON shipping_method_zone_config(is_active);
CREATE INDEX IF NOT EXISTS idx_shipping_method_templates_active ON shipping_method_templates(is_active);

-- 4. Create view for easy querying
CREATE OR REPLACE VIEW shipping_methods_with_zones AS
SELECT 
  smt.id as method_id,
  smt.name,
  smt.description,
  smt.type,
  smt.rules,
  smt.is_active as method_active,
  smt.sort_order,
  smzc.id as config_id,
  smzc.zone_id,
  sz.name as zone_name,
  sz.pincodes,
  smzc.price,
  smzc.free_shipping_minimum,
  smzc.delivery_time,
  smzc.is_active as zone_active,
  sz.is_active as zone_is_active
FROM shipping_method_templates smt
LEFT JOIN shipping_method_zone_config smzc ON smt.id = smzc.method_template_id
LEFT JOIN shipping_zones sz ON smzc.zone_id = sz.id
ORDER BY smt.sort_order, sz.name;

-- 5. Insert some default shipping method templates
INSERT INTO shipping_method_templates (name, description, type, rules, sort_order) VALUES
('Same Day Delivery', 'Fast delivery within the same day', 'same_day', 'Order before 2 PM for same-day delivery. Available on business days only.', 1),
('Next Day Delivery', 'Delivery by next business day', 'next_day', 'Orders placed before 6 PM will be delivered next business day.', 2),
('Standard Delivery', 'Regular delivery service', 'standard', 'Standard delivery within 2-5 business days.', 3),
('Express Delivery', 'Priority express delivery', 'express', 'Express delivery with priority handling and tracking.', 4),
('Scheduled Delivery', 'Delivery at your preferred time slot', 'scheduled', 'Choose your preferred delivery date and time slot during checkout.', 5)
ON CONFLICT DO NOTHING;

-- 6. Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shipping_method_templates_updated_at 
  BEFORE UPDATE ON shipping_method_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_method_zone_config_updated_at 
  BEFORE UPDATE ON shipping_method_zone_config 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. RLS Policies
ALTER TABLE shipping_method_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_method_zone_config ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (admin access)
CREATE POLICY "Allow all for authenticated users" ON shipping_method_templates
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON shipping_method_zone_config
  FOR ALL TO authenticated USING (true);

-- Allow read access for anonymous users (for checkout)
CREATE POLICY "Allow read for anonymous" ON shipping_method_templates
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Allow read for anonymous" ON shipping_method_zone_config
  FOR SELECT TO anon USING (is_active = true);
