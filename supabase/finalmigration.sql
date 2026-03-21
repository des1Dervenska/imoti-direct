-- =============================================================================
-- FINAL Migration: incremental updates (пусни целия файл в Supabase SQL Editor)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) properties.code – вътрешен код (картички, търсене в админ)
-- -----------------------------------------------------------------------------
ALTER TABLE properties ADD COLUMN IF NOT EXISTS code VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_properties_code ON properties(code)
  WHERE code IS NOT NULL AND btrim(code) <> '';

COMMENT ON COLUMN properties.code IS 'Вътрешен код на обявата (стринг); показва се на клиентските картички';

-- =============================================================================
-- 2) Home posters (3 advertising posters)
-- =============================================================================
-- Adds a separate table for homepage posters editable from admin.

CREATE TABLE IF NOT EXISTS home_posters (
  position SMALLINT PRIMARY KEY CHECK (position BETWEEN 1 AND 3),
  image_url TEXT,
  image_url_en TEXT,
  link_url TEXT,
  link_url_en TEXT,
  text_bg TEXT,
  text_en TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_home_posters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_home_posters_updated_at ON home_posters;
CREATE TRIGGER trigger_home_posters_updated_at
  BEFORE UPDATE ON home_posters
  FOR EACH ROW
  EXECUTE FUNCTION update_home_posters_updated_at();

ALTER TABLE home_posters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view home posters" ON home_posters;
CREATE POLICY "Public can view home posters"
  ON home_posters
  FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Authenticated users can manage home posters" ON home_posters;
CREATE POLICY "Authenticated users can manage home posters"
  ON home_posters
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);
