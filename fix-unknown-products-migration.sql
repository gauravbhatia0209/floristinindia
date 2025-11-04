-- Update order_items with correct product names from the products table
UPDATE order_items
SET product_name = products.name
FROM products
WHERE order_items.product_id = products.id
  AND order_items.product_name = 'Unknown Product';

-- Verify the update
SELECT COUNT(*) as remaining_unknown_products
FROM order_items
WHERE product_name = 'Unknown Product';
