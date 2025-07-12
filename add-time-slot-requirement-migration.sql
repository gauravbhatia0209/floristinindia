-- Add time_slot_required field to shipping_method_templates table
ALTER TABLE shipping_method_templates 
ADD COLUMN IF NOT EXISTS time_slot_required BOOLEAN DEFAULT false;

-- Update the view to include the new field
CREATE OR REPLACE VIEW shipping_methods_with_zones AS
SELECT 
  smt.id as method_id,
  smt.name,
  smt.description,
  smt.type,
  smt.rules,
  smt.time_slot_required,
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

-- Update some default shipping methods to require time slots
UPDATE shipping_method_templates 
SET time_slot_required = true 
WHERE type IN ('same_day', 'scheduled');
