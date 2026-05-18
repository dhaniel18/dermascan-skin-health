-- ============================================================
-- DermaScan — Complete Combined Schema + Seed
-- Run this as ONE block in Supabase SQL Editor
-- after running the DROP statements above.
-- ============================================================

-- ── INGREDIENTS ──────────────────────────────────────────────
CREATE TABLE ingredients (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  aliases         TEXT[]  NOT NULL DEFAULT '{}',
  is_comedogenic  BOOLEAN NOT NULL DEFAULT false,
  allergen_risk   TEXT    NOT NULL DEFAULT 'Low',
  unsuitable_for  TEXT[]  NOT NULL DEFAULT '{}',
  category        TEXT    NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ingredients_name    ON ingredients (LOWER(name));
CREATE INDEX idx_ingredients_aliases ON ingredients USING gin(aliases);

-- ── COMBINATION WARNINGS ─────────────────────────────────────
CREATE TABLE combination_warnings (
  rule_id     TEXT PRIMARY KEY,
  ingredient1 TEXT NOT NULL REFERENCES ingredients(id),
  ingredient2 TEXT NOT NULL REFERENCES ingredients(id),
  severity    TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cw_pair ON combination_warnings (ingredient1, ingredient2);

-- ── PROFILES (must exist before trigger) ─────────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  skin_type     TEXT,
  conditions    TEXT[]  NOT NULL DEFAULT '{}',
  concerns      TEXT[]  NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── PRODUCTS ─────────────────────────────────────────────────
CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode             TEXT UNIQUE,
  name                TEXT NOT NULL,
  brand               TEXT,
  category            TEXT,
  ingredient_ids      TEXT[]  NOT NULL DEFAULT '{}',
  raw_ingredient_text TEXT,
  verification_status TEXT NOT NULL DEFAULT 'Pending',
  uploaded_by         UUID REFERENCES auth.users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_barcode     ON products (barcode);
CREATE INDEX idx_products_name        ON products (LOWER(name));
CREATE INDEX idx_products_ingredients ON products USING gin(ingredient_ids);
CREATE INDEX idx_products_status      ON products (verification_status);

-- ── SCAN HISTORY ─────────────────────────────────────────────
CREATE TABLE scan_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  scan_method  TEXT NOT NULL DEFAULT 'barcode',
  safety_score INT,
  warnings     JSONB NOT NULL DEFAULT '[]',
  scanned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX idx_sh_user_time ON scan_history (user_id, scanned_at DESC);

-- ── SAVED PRODUCTS ───────────────────────────────────────────
CREATE TABLE saved_products (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- ── USER ROUTINE ─────────────────────────────────────────────
CREATE TABLE user_routine (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  time_of_day  TEXT NOT NULL DEFAULT 'any',
  added_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- ── AI RESEARCH LOG ──────────────────────────────────────────
CREATE TABLE ai_research_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  resolved_id     TEXT,
  success         BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_arl_user    ON ai_research_log (user_id, created_at DESC);
CREATE INDEX idx_arl_created ON ai_research_log (created_at DESC);

-- ── AUTO-UPDATE updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── AUTO-CREATE PROFILE ON SIGN-UP ───────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE ingredients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE combination_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history         ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_routine         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_research_log      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ingredients_read"    ON ingredients          FOR SELECT USING (true);
CREATE POLICY "warnings_read"       ON combination_warnings FOR SELECT USING (true);
CREATE POLICY "profiles_self"       ON profiles             USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "scan_history_self"   ON scan_history         USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_products_self" ON saved_products       USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "routine_self"        ON user_routine         USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "arl_self"            ON ai_research_log      USING (auth.uid() = user_id);

CREATE POLICY "products_read"   ON products FOR SELECT USING (verification_status = 'Verified' OR uploaded_by = auth.uid());
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "products_update" ON products FOR UPDATE USING (uploaded_by = auth.uid());


-- ── SEED: INGREDIENTS ───────────────────────────────────────
INSERT INTO ingredients (id, name, aliases, is_comedogenic, allergen_risk, unsuitable_for, category) VALUES
  ('ING-001', 'Salicylic Acid', '{"BHA","Beta Hydroxy Acid"}', false, 'Low', '{"Extremely Dry","Sensitive"}', 'Active - Exfoliant'),
  ('ING-002', 'Retinol', '{"Vitamin A","Retinyl Palmitate"}', false, 'Medium', '{"Sensitive","Pregnant"}', 'Active - Anti-aging'),
  ('ING-003', 'Niacinamide', '{"Vitamin B3","Nicotinamide"}', false, 'Low', '{"None"}', 'Active - Brightening'),
  ('ING-004', 'Ascorbic Acid', '{"Vitamin C","L-Ascorbic Acid"}', false, 'Medium', '{"Sensitive"}', 'Active - Antioxidant'),
  ('ING-005', 'Ceramide NP', '{"Ceramide 3"}', false, 'Low', '{"None"}', 'Hydrator'),
  ('ING-006', 'Mineral Oil', '{"Paraffinum Liquidum","Petrolatum"}', true, 'Low', '{"Oily","Acne-Prone"}', 'Emollient'),
  ('ING-007', 'Fragrance', '{"Parfum","Perfume","Essential Oil"}', false, 'High', '{"Sensitive","Acne-Prone"}', 'Additive'),
  ('ING-008', 'Alcohol Denat', '{"SD Alcohol","Denatured Alcohol","Ethanol"}', false, 'High', '{"Dry","Sensitive"}', 'Solvent'),
  ('ING-009', 'Dimethicone', '{"Polydimethylsiloxane"}', true, 'Low', '{"Oily","Acne-Prone"}', 'Silicone'),
  ('ING-010', 'Sodium Hyaluronate', '{"Hyaluronic Acid","HA"}', false, 'Low', '{"None"}', 'Hydrator'),
  ('ING-011', 'Glycolic Acid', '{"AHA","Alpha Hydroxy Acid"}', false, 'Medium', '{"Sensitive","Rosacea"}', 'Active - Exfoliant'),
  ('ING-012', 'Lactic Acid', '{"AHA"}', false, 'Low', '{"Extremely Sensitive"}', 'Active - Exfoliant'),
  ('ING-013', 'Mandelic Acid', '{"AHA"}', false, 'Low', '{"None"}', 'Active - Exfoliant'),
  ('ING-014', 'Gluconolactone', '{"PHA","Polyhydroxy Acid"}', false, 'Low', '{"None"}', 'Active - Exfoliant'),
  ('ING-015', 'Panthenol', '{"Pro-Vitamin B5"}', false, 'Low', '{"None"}', 'Soothing Agent'),
  ('ING-016', 'Glycerin', '{"Glycerol"}', false, 'Low', '{"None"}', 'Hydrator'),
  ('ING-017', 'Centella Asiatica Extract', '{"Cica","Gotu Kola"}', false, 'Low', '{"None"}', 'Botanical - Soothing'),
  ('ING-018', 'Aloe Barbadensis Leaf Juice', '{"Aloe Vera"}', false, 'Low', '{"None"}', 'Botanical - Soothing'),
  ('ING-019', 'Melaleuca Alternifolia Leaf Oil', '{"Tea Tree Oil"}', false, 'Medium', '{"Sensitive"}', 'Botanical - Anti-acne'),
  ('ING-020', 'Squalane', '{"Plant Squalane"}', false, 'Low', '{"None"}', 'Emollient'),
  ('ING-021', 'Butyrospermum Parkii Butter', '{"Shea Butter"}', true, 'Low', '{"Oily","Acne-Prone"}', 'Emollient'),
  ('ING-022', 'Simmondsia Chinensis Seed Oil', '{"Jojoba Oil"}', false, 'Low', '{"None"}', 'Emollient'),
  ('ING-023', 'Rosa Canina Fruit Oil', '{"Rosehip Oil"}', false, 'Low', '{"None"}', 'Emollient'),
  ('ING-024', 'Tocopherol', '{"Vitamin E"}', false, 'Low', '{"None"}', 'Antioxidant'),
  ('ING-025', 'Phenoxyethanol', '{"Preservative"}', false, 'Low', '{"None"}', 'Preservative'),
  ('ING-026', 'Methylparaben', '{"Paraben"}', false, 'Medium', '{"Sensitive"}', 'Preservative'),
  ('ING-027', 'Propylparaben', '{"Paraben"}', false, 'Medium', '{"Sensitive"}', 'Preservative'),
  ('ING-028', 'Sodium Lauryl Sulfate', '{"SLS"}', true, 'High', '{"Dry","Sensitive","Acne-Prone"}', 'Surfactant'),
  ('ING-029', 'Sodium Laureth Sulfate', '{"SLES"}', false, 'Medium', '{"Dry","Sensitive"}', 'Surfactant'),
  ('ING-030', 'Cocamidopropyl Betaine', '{"CAPB"}', false, 'Low', '{"None"}', 'Surfactant'),
  ('ING-031', 'Zinc Oxide', '{"Mineral UV Filter"}', false, 'Low', '{"None"}', 'UV Filter'),
  ('ING-032', 'Titanium Dioxide', '{"Mineral UV Filter"}', false, 'Low', '{"None"}', 'UV Filter'),
  ('ING-033', 'Avobenzone', '{"Butyl Methoxydibenzoylmethane"}', false, 'Medium', '{"Sensitive"}', 'UV Filter'),
  ('ING-034', 'Octinoxate', '{"Ethylhexyl Methoxycinnamate"}', false, 'Low', '{"None"}', 'UV Filter'),
  ('ING-035', 'Linalool', '{"Fragrance Component"}', false, 'High', '{"Sensitive"}', 'Additive'),
  ('ING-036', 'Limonene', '{"Fragrance Component"}', false, 'High', '{"Sensitive"}', 'Additive'),
  ('ING-037', 'Allantoin', '{}', false, 'Low', '{"None"}', 'Soothing Agent'),
  ('ING-038', 'Snail Secretion Filtrate', '{"Snail Mucin"}', false, 'Low', '{"None"}', 'Hydrator'),
  ('ING-039', 'Caprylic/Capric Triglyceride', '{"Fractionated Coconut Oil"}', false, 'Low', '{"None"}', 'Emollient'),
  ('ING-040', 'Cocos Nucifera Oil', '{"Coconut Oil"}', true, 'Low', '{"Oily","Acne-Prone"}', 'Emollient'),
  ('ING-041', 'Olea Europaea Fruit Oil', '{"Olive Oil"}', true, 'Low', '{"Oily","Acne-Prone"}', 'Emollient'),
  ('ING-042', 'Argania Spinosa Kernel Oil', '{"Argan Oil"}', false, 'Low', '{"None"}', 'Emollient'),
  ('ING-043', 'Isopropyl Myristate', '{}', true, 'Low', '{"Oily","Acne-Prone"}', 'Emollient'),
  ('ING-044', 'Isopropyl Palmitate', '{}', true, 'Low', '{"Oily","Acne-Prone"}', 'Emollient'),
  ('ING-045', 'Cetearyl Alcohol', '{"Fatty Alcohol"}', false, 'Low', '{"None"}', 'Emulsifier'),
  ('ING-046', 'Stearyl Alcohol', '{"Fatty Alcohol"}', true, 'Low', '{"Oily","Acne-Prone"}', 'Emulsifier'),
  ('ING-047', 'Myristic Acid', '{"Fatty Acid"}', true, 'Low', '{"Oily","Acne-Prone"}', 'Surfactant'),
  ('ING-048', 'Palmitic Acid', '{"Fatty Acid"}', true, 'Low', '{"Oily","Acne-Prone"}', 'Emulsifier'),
  ('ING-049', 'Stearic Acid', '{"Fatty Acid"}', true, 'Low', '{"Oily","Acne-Prone"}', 'Emulsifier'),
  ('ING-050', 'Butylene Glycol', '{}', false, 'Low', '{"None"}', 'Solvent'),
  ('ING-051', 'Propylene Glycol', '{}', false, 'Medium', '{"Sensitive"}', 'Solvent'),
  ('ING-052', 'Propanediol', '{}', false, 'Low', '{"None"}', 'Solvent'),
  ('ING-053', 'Cyclopentasiloxane', '{"Silicone","D5"}', false, 'Low', '{"None"}', 'Silicone'),
  ('ING-054', 'Cyclohexasiloxane', '{"Silicone"}', false, 'Low', '{"None"}', 'Silicone'),
  ('ING-055', 'Amodimethicone', '{"Silicone"}', false, 'Low', '{"None"}', 'Silicone'),
  ('ING-056', 'Disodium EDTA', '{"EDTA"}', false, 'Low', '{"None"}', 'Chelating Agent'),
  ('ING-057', 'Tetrasodium EDTA', '{"EDTA"}', false, 'Low', '{"None"}', 'Chelating Agent'),
  ('ING-058', 'Carbomer', '{}', false, 'Low', '{"None"}', 'Texture Enhancer'),
  ('ING-059', 'Xanthan Gum', '{}', false, 'Low', '{"None"}', 'Texture Enhancer'),
  ('ING-060', 'Sodium Hydroxide', '{"Lye"}', false, 'Medium', '{"Sensitive"}', 'pH Adjuster'),
  ('ING-061', 'Citric Acid', '{}', false, 'Medium', '{"Sensitive"}', 'pH Adjuster'),
  ('ING-062', 'Triethanolamine', '{"TEA"}', true, 'Medium', '{"Oily","Acne-Prone","Sensitive"}', 'pH Adjuster'),
  ('ING-063', 'Benzyl Alcohol', '{"Preservative"}', false, 'High', '{"Sensitive"}', 'Preservative'),
  ('ING-064', 'Ethylhexylglycerin', '{}', false, 'Low', '{"None"}', 'Preservative'),
  ('ING-065', 'Chlorphenesin', '{"Preservative"}', false, 'Low', '{"None"}', 'Preservative'),
  ('ING-066', 'Potassium Sorbate', '{"Preservative"}', false, 'Low', '{"None"}', 'Preservative'),
  ('ING-067', 'Sodium Benzoate', '{"Preservative"}', false, 'Low', '{"None"}', 'Preservative'),
  ('ING-068', 'BHT', '{"Butylated Hydroxytoluene"}', false, 'Medium', '{"None"}', 'Antioxidant'),
  ('ING-069', 'BHA (Preservative)', '{"Butylated Hydroxyanisole"}', false, 'Medium', '{"None"}', 'Antioxidant'),
  ('ING-070', 'Talc', '{"Talcum Powder"}', true, 'Low', '{"Oily","Acne-Prone"}', 'Absorbent'),
  ('ING-071', 'Mica', '{"Colorant"}', false, 'Low', '{"None"}', 'Colorant'),
  ('ING-072', 'Iron Oxides', '{"CI 77491","CI 77492","CI 77499"}', false, 'Low', '{"None"}', 'Colorant'),
  ('ING-073', 'Bismuth Oxychloride', '{"CI 77163"}', true, 'Low', '{"Acne-Prone"}', 'Colorant'),
  ('ING-074', 'Kojic Acid', '{}', false, 'Medium', '{"Sensitive"}', 'Active - Brightening'),
  ('ING-075', 'Alpha-Arbutin', '{"Arbutin"}', false, 'Low', '{"None"}', 'Active - Brightening'),
  ('ING-076', 'Tranexamic Acid', '{}', false, 'Low', '{"None"}', 'Active - Brightening'),
  ('ING-077', 'Azelaic Acid', '{}', false, 'Low', '{"None"}', 'Active - Anti-acne'),
  ('ING-078', 'Benzoyl Peroxide', '{"BPO"}', false, 'High', '{"Dry","Sensitive"}', 'Active - Anti-acne'),
  ('ING-079', 'Sulfur', '{}', false, 'Low', '{"Dry"}', 'Active - Anti-acne'),
  ('ING-080', 'Urea', '{}', false, 'Low', '{"None"}', 'Hydrator'),
  ('ING-081', 'Copper Peptides', '{"GHK-Cu"}', false, 'Low', '{"None"}', 'Active - Anti-aging'),
  ('ING-082', 'Matrixyl 3000', '{"Palmitoyl Tetrapeptide-7","Palmitoyl Tripeptide-1"}', false, 'Low', '{"None"}', 'Active - Anti-aging'),
  ('ING-083', 'Argireline', '{"Acetyl Hexapeptide-8"}', false, 'Low', '{"None"}', 'Active - Anti-aging'),
  ('ING-084', 'Resveratrol', '{}', false, 'Low', '{"None"}', 'Antioxidant'),
  ('ING-085', 'Ferulic Acid', '{}', false, 'Low', '{"None"}', 'Antioxidant'),
  ('ING-086', 'Phytic Acid', '{}', false, 'Low', '{"None"}', 'Antioxidant'),
  ('ING-087', 'Beta-Glucan', '{}', false, 'Low', '{"None"}', 'Hydrator'),
  ('ING-088', 'Ceramide EOP', '{"Ceramide 1"}', false, 'Low', '{"None"}', 'Hydrator'),
  ('ING-089', 'Ceramide AP', '{"Ceramide 6 II"}', false, 'Low', '{"None"}', 'Hydrator'),
  ('ING-090', 'Cholesterol', '{}', false, 'Low', '{"None"}', 'Emollient'),
  ('ING-091', 'Phytosphingosine', '{}', false, 'Low', '{"None"}', 'Hydrator'),
  ('ING-092', 'Camellia Sinensis Leaf Extract', '{"Green Tea Extract"}', false, 'Low', '{"None"}', 'Botanical - Antioxidant'),
  ('ING-093', 'Glycyrrhiza Glabra Root Extract', '{"Licorice Root Extract"}', false, 'Low', '{"None"}', 'Botanical - Brightening'),
  ('ING-094', 'Chamomilla Recutita Flower Extract', '{"Chamomile Extract"}', false, 'Medium', '{"Sensitive"}', 'Botanical - Soothing'),
  ('ING-095', 'Rosmarinus Officinalis Leaf Extract', '{"Rosemary Extract"}', false, 'Medium', '{"Sensitive"}', 'Botanical - Antioxidant'),
  ('ING-096', 'Eugenol', '{"Fragrance Component"}', false, 'High', '{"Sensitive"}', 'Additive'),
  ('ING-097', 'Geraniol', '{"Fragrance Component"}', false, 'High', '{"Sensitive"}', 'Additive'),
  ('ING-098', 'Citronellol', '{"Fragrance Component"}', false, 'High', '{"Sensitive"}', 'Additive'),
  ('ING-099', 'Hexyl Cinnamal', '{"Fragrance Component"}', false, 'High', '{"Sensitive"}', 'Additive'),
  ('ING-100', 'Octocrylene', '{"UV Filter"}', false, 'Medium', '{"Sensitive"}', 'UV Filter')
ON CONFLICT (id) DO NOTHING;

-- ── SEED: COMBINATION WARNINGS ─────────────────────────────
INSERT INTO combination_warnings (rule_id, ingredient1, ingredient2, severity, title, message) VALUES
  ('WARN-001', 'ING-001', 'ING-002', 'High', 'Severe Barrier Risk', 'BAHAYA: Mencampur BHA (Salicylic Acid) dan Retinol dapat menyebabkan iritasi parah, kemerahan, dan mengelupas. Pisahkan penggunaannya (BHA Pagi / Retinol Malam).'),
  ('WARN-002', 'ING-004', 'ING-002', 'Medium', 'pH Imbalance & Irritation', 'PERINGATAN: Vitamin C dan Retinol bekerja di tingkat pH yang berbeda dan sangat mengiritasi jika digabung. Gunakan Vitamin C di pagi hari dan Retinol di malam hari.'),
  ('WARN-003', 'ING-001', 'ING-004', 'High', 'Acid Overload', 'BAHAYA: Menggunakan BHA bersamaan dengan Vitamin C (Ascorbic Acid) sangat rentan memicu iritasi dan rasa terbakar pada kulit karena keduanya bersifat asam.'),
  ('WARN-004', 'ING-011', 'ING-002', 'High', 'Severe Barrier Risk', 'BAHAYA: Glycolic Acid (AHA) adalah eksfoliator kuat. Melapisinya dengan Retinol akan menghancurkan skin barrier. Selang-seling penggunaan di malam yang berbeda.'),
  ('WARN-005', 'ING-012', 'ING-002', 'High', 'Severe Barrier Risk', 'BAHAYA: Lactic Acid (AHA) ditambah Retinol berisiko tinggi membuat kulit kering terkelupas dan sensitif terhadap cahaya matahari.'),
  ('WARN-006', 'ING-011', 'ING-001', 'Medium', 'Over-Exfoliation Risk', 'PERINGATAN: Menggabungkan AHA (Glycolic) dan BHA dapat menyebabkan over-eksfoliasi. Hanya gunakan jika kulitmu sangat toleran atau formulanya memang sudah dicampur dari pabrik.'),
  ('WARN-007', 'ING-078', 'ING-002', 'High', 'Ingredient Deactivation', 'BAHAYA: Benzoyl Peroxide dan Retinol akan saling membatalkan efektivitas satu sama lain (deaktivasi) sekaligus memicu kekeringan kulit yang ekstrem.'),
  ('WARN-008', 'ING-078', 'ING-004', 'High', 'Oxidation Warning', 'BAHAYA: Benzoyl Peroxide akan langsung mengoksidasi Vitamin C, membuatnya tidak berguna sama sekali untuk kulitmu.'),
  ('WARN-009', 'ING-078', 'ING-001', 'High', 'Extreme Dryness Risk', 'BAHAYA: BHA dan Benzoyl Peroxide adalah dua agen anti-jerawat yang sangat mengeringkan. Melapisinya dapat memicu inflamasi dan luka pada jerawat.'),
  ('WARN-010', 'ING-081', 'ING-004', 'High', 'Ingredient Deactivation', 'BAHAYA: Copper Peptides dan Vitamin C murni (Ascorbic Acid) tidak boleh digabung. Vitamin C akan memecah rantai peptida dan membuatnya tidak berfungsi.'),
  ('WARN-011', 'ING-081', 'ING-011', 'High', 'Peptide Breakdown', 'BAHAYA: Tingkat keasaman yang tinggi dari Glycolic Acid (AHA) akan merusak ikatan asam amino pada Copper Peptides.'),
  ('WARN-012', 'ING-081', 'ING-001', 'Medium', 'Peptide Breakdown', 'PERINGATAN: BHA dapat menurunkan pH kulit secara drastis, berisiko mengganggu kerja seluler dari Copper Peptides.'),
  ('WARN-013', 'ING-011', 'ING-004', 'High', 'Acid Overload', 'BAHAYA: Glycolic Acid dan Vitamin C sama-sama mengandalkan lingkungan pH rendah. Melapisinya dapat memicu rasa terbakar yang hebat, terutama pada kulit sensitif.'),
  ('WARN-014', 'ING-004', 'ING-003', 'Medium', 'Potential Niacin Flush', 'PERINGATAN: Meski banyak diperdebatkan, menggabungkan Vitamin C murni dan Niacinamide pada kulit yang sensitif dapat memicu kemerahan sementara (Niacin Flush).'),
  ('WARN-015', 'ING-008', 'ING-002', 'High', 'Excessive Drying', 'BAHAYA: Produk dengan kandungan Alcohol Denat tinggi akan merusak lipid kulit, dan jika digabung dengan Retinol, akan menyebabkan iritasi parah.'),
  ('WARN-016', 'ING-008', 'ING-011', 'Medium', 'Barrier Disruption', 'PERINGATAN: AHA (Glycolic Acid) sudah mengelupas kulit mati. Menambahkan produk berbasis Alkohol tinggi akan menembus terlalu dalam dan memicu sensasi perih.'),
  ('WARN-017', 'ING-077', 'ING-011', 'Medium', 'Exfoliation Overload', 'PERINGATAN: Azelaic Acid memiliki sifat eksfoliasi ringan. Digabungkan dengan Glycolic Acid (AHA) bisa terlalu agresif untuk pemula.'),
  ('WARN-018', 'ING-077', 'ING-001', 'Medium', 'Exfoliation Overload', 'PERINGATAN: BHA dan Azelaic Acid sama-sama merawat pori-pori. Melapisinya bisa menyebabkan kulit terasa tertarik dan kering.'),
  ('WARN-019', 'ING-074', 'ING-011', 'Medium', 'High Irritation Potential', 'PERINGATAN: Kojic Acid (pencerah) dapat mengiritasi kulit. Melapisinya dengan AHA (Glycolic Acid) meningkatkan penyerapan Kojic Acid ke tingkat yang bisa memicu dermatitis kontak.'),
  ('WARN-020', 'ING-074', 'ING-002', 'Medium', 'High Irritation Potential', 'PERINGATAN: Retinol dan Kojic Acid sangat ampuh untuk hiperpigmentasi, tetapi melapisinya secara bersamaan berisiko tinggi menimbulkan peradangan.'),
  ('WARN-021', 'ING-028', 'ING-002', 'High', 'Surfactant Damage', 'BAHAYA: Menggunakan pembersih keras berbahan SLS (Sodium Lauryl Sulfate) sebelum mengoleskan Retinol akan memperparah efek samping Retinol secara eksponensial.'),
  ('WARN-022', 'ING-028', 'ING-011', 'High', 'Surfactant Damage', 'BAHAYA: Sabun cuci muka berbahan SLS mengikis minyak alami kulit. Diikuti dengan toner AHA, ini adalah resep pasti untuk merusak skin barrier.'),
  ('WARN-023', 'ING-078', 'ING-011', 'High', 'Chemical Burn Risk', 'BAHAYA: Benzoyl Peroxide digabungkan dengan Glycolic Acid sangat korosif pada kulit dan dapat memicu luka bakar kimiawi tingkat ringan.'),
  ('WARN-024', 'ING-078', 'ING-012', 'High', 'Chemical Burn Risk', 'BAHAYA: Benzoyl Peroxide dan Lactic Acid (AHA). Jangan pernah melapisinya kecuali atas anjuran langsung dari dokter kulit spesialis.'),
  ('WARN-025', 'ING-081', 'ING-002', 'Medium', 'Tolerability Issue', 'PERINGATAN: Meskipun tidak saling membatalkan, melapisi Copper Peptides dan Retinol bersamaan dapat memicu sensitivitas bagi kulit yang belum terbiasa.')
ON CONFLICT (rule_id) DO NOTHING;