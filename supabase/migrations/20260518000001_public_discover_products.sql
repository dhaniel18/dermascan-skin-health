ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_read" ON products;

CREATE POLICY "products_read" ON products
  FOR SELECT
  USING (
    verification_status IN ('Pending', 'Verified') OR uploaded_by = auth.uid()
  );
