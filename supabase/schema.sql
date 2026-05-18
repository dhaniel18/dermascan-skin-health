-- ============================================================
-- DermaScan — Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor to set up the database.
-- ============================================================

-- ── 1. INGREDIENTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ingredients (
  id              TEXT PRIMARY KEY,           -- e.g. "ING-001"
  name            TEXT NOT NULL,
  aliases         TEXT[]  NOT NULL DEFAULT '{}',
  is_comedogenic  BOOLEAN NOT NULL DEFAULT false,
  allergen_risk   TEXT    NOT NULL DEFAULT 'Low',  -- Low | Medium | High
  unsuitable_for  TEXT[]  NOT NULL DEFAULT '{}',
  category        TEXT    NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingredients_name    ON ingredients (LOWER(name));
CREATE INDEX IF NOT EXISTS idx_ingredients_aliases ON ingredients USING gin(aliases);

-- ── 2. COMBINATION WARNINGS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS combination_warnings (
  rule_id     TEXT PRIMARY KEY,              -- e.g. "WARN-001"
  ingredient1 TEXT NOT NULL REFERENCES ingredients(id),
  ingredient2 TEXT NOT NULL REFERENCES ingredients(id),
  severity    TEXT NOT NULL,                 -- Low | Medium | High
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cw_pair ON combination_warnings (ingredient1, ingredient2);

-- ── 3. PRODUCTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode             TEXT UNIQUE,
  name                TEXT NOT NULL,
  brand               TEXT,
  category            TEXT,
  image_url           TEXT,
  ingredient_ids      TEXT[]  NOT NULL DEFAULT '{}',  -- array of ING-xxx refs
  raw_ingredient_text TEXT,                           -- original OCR / label text
  verification_status TEXT NOT NULL DEFAULT 'Pending', -- Pending | Verified | Rejected
  uploaded_by         UUID REFERENCES auth.users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_barcode     ON products (barcode);
CREATE INDEX IF NOT EXISTS idx_products_name        ON products (LOWER(name));
CREATE INDEX IF NOT EXISTS idx_products_ingredients ON products USING gin(ingredient_ids);
CREATE INDEX IF NOT EXISTS idx_products_status      ON products (verification_status);

-- ── 4. PROFILES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  skin_type   TEXT,                          -- oily | dry | combination | normal | sensitive
  conditions  TEXT[]  NOT NULL DEFAULT '{}', -- sensitive | acne | rosacea | eczema | aging
  concerns    TEXT[]  NOT NULL DEFAULT '{}', -- acne | dark | dullness | redness | wrinkles | pores | texture | dehydration
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5. SCAN HISTORY ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scan_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES products(id),
  product_name TEXT NOT NULL,               -- denormalised for offline display
  scan_method  TEXT NOT NULL DEFAULT 'barcode', -- barcode | ocr | manual
  safety_score INT,                         -- 0-100
  warnings     JSONB NOT NULL DEFAULT '[]', -- snapshot of warnings at scan time
  scanned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)              -- upsert: one row per product per user
);

CREATE INDEX IF NOT EXISTS idx_sh_user_time ON scan_history (user_id, scanned_at DESC);

-- ── 6. SAVED PRODUCTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_products (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- ── 7. USER ROUTINE (for layering checker) ──────────────────
CREATE TABLE IF NOT EXISTS user_routine (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  time_of_day  TEXT NOT NULL DEFAULT 'any',  -- morning | evening | any
  added_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- ── 8. AUTO-UPDATE updated_at ───────────────────────────────
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

-- ── 9. AUTO-CREATE PROFILE ON SIGN-UP ───────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 10. ROW LEVEL SECURITY ──────────────────────────────────
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history    ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_routine    ENABLE ROW LEVEL SECURITY;

-- profiles: own row only
CREATE POLICY "profiles_self" ON profiles
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- scan_history: own rows only
CREATE POLICY "scan_history_self" ON scan_history
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- saved_products: own rows only
CREATE POLICY "saved_products_self" ON saved_products
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_routine: own rows only
CREATE POLICY "routine_self" ON user_routine
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- products: everyone reads verified; only uploader edits pending
CREATE POLICY "products_read" ON products FOR SELECT USING (
  verification_status IN ('Pending', 'Verified') OR uploaded_by = auth.uid()
);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);
CREATE POLICY "products_update" ON products FOR UPDATE USING (
  uploaded_by = auth.uid()
);

-- ingredients & warnings: public read-only
ALTER TABLE ingredients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE combination_warnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ingredients_read" ON ingredients FOR SELECT USING (true);
CREATE POLICY "warnings_read"    ON combination_warnings FOR SELECT USING (true);
