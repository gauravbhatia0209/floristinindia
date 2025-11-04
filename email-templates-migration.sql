-- Create email_templates table for storing customizable email templates
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  template_type VARCHAR(50) NOT NULL, -- 'order_confirmation' or 'status_update'
  order_status VARCHAR(50), -- e.g., 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled' (NULL for confirmation emails)
  subject TEXT NOT NULL,
  body TEXT NOT NULL, -- Rich HTML content with template variables
  sections JSONB DEFAULT '{}', -- Which sections to include: {items_table, delivery_address, special_instructions, etc.}
  template_variables JSONB DEFAULT '{}', -- Available variables for this template
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by uuid REFERENCES auth.users(id),
  
  -- Constraint to ensure unique templates per type/status combination
  CONSTRAINT unique_template_per_type UNIQUE(template_type, order_status)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_templates_type_status ON email_templates(template_type, order_status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all templates" ON email_templates
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can create templates" ON email_templates
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can update templates" ON email_templates
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  ) WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can delete templates" ON email_templates
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_email_templates_timestamp BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Insert default templates
INSERT INTO email_templates (template_type, order_status, subject, body, sections, is_active)
VALUES (
  'order_confirmation',
  NULL,
  'Order Confirmation #{ORDER_NUMBER} - Florist in India',
  '<h2>Order Confirmed!</h2><p>Thank you for your order, {CUSTOMER_NAME}!</p><p>Your order number is <strong>#{ORDER_NUMBER}</strong></p><p>Total: ₹{TOTAL_AMOUNT}</p>',
  '{"items_table": true, "delivery_address": true, "delivery_date": true, "special_instructions": true}',
  true
),
(
  'status_update',
  'confirmed',
  'Order Update: #{ORDER_NUMBER} - Confirmed',
  '<h2>Your Order Has Been Confirmed!</h2><p>Hi {CUSTOMER_NAME},</p><p>We are pleased to confirm your order #{ORDER_NUMBER}. Our team is now preparing your flowers with care.</p><p>You will receive another update once your order ships.</p>',
  '{"delivery_date": true, "special_instructions": true}',
  true
),
(
  'status_update',
  'processing',
  'Order Update: #{ORDER_NUMBER} - Processing',
  '<h2>Your Order Is Being Prepared!</h2><p>Hi {CUSTOMER_NAME},</p><p>Your order #{ORDER_NUMBER} is now being prepared. Our florists are carefully arranging your flowers.</p>',
  '{"delivery_date": true}',
  true
),
(
  'status_update',
  'shipped',
  'Order Update: #{ORDER_NUMBER} - Shipped',
  '<h2>Your Order Is On Its Way!</h2><p>Hi {CUSTOMER_NAME},</p><p>Great news! Your order #{ORDER_NUMBER} has been shipped and is on its way to you.</p><p>Estimated delivery: {DELIVERY_DATE}</p>',
  '{"delivery_date": true, "delivery_address": true}',
  true
),
(
  'status_update',
  'delivered',
  'Order Update: #{ORDER_NUMBER} - Delivered',
  '<h2>Your Order Has Been Delivered!</h2><p>Hi {CUSTOMER_NAME},</p><p>Your order #{ORDER_NUMBER} has been successfully delivered.</p><p>We hope you love your flowers! Please share your feedback with us.</p>',
  '{}',
  true
),
(
  'status_update',
  'cancelled',
  'Order Update: #{ORDER_NUMBER} - Cancelled',
  '<h2>Your Order Has Been Cancelled</h2><p>Hi {CUSTOMER_NAME},</p><p>Your order #{ORDER_NUMBER} has been cancelled as requested.</p><p>If you have any questions, please contact our support team.</p>',
  '{}',
  true
) ON CONFLICT (template_type, order_status) DO NOTHING;
