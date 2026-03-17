-- =============================================================================
-- Migration 009 (FINAL): Забележка цена (български + английски)
-- =============================================================================
-- price_note = български; price_note_en = английски. В админ се въвеждат под полето за цена;
-- при клиента се показва над „Основни характеристики“ според езика.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS price_note TEXT NULL,
  ADD COLUMN IF NOT EXISTS price_note_en TEXT NULL;

COMMENT ON COLUMN properties.price_note IS 'Забележка към цената (БГ) – показва се над Основни характеристики при клиента';
COMMENT ON COLUMN properties.price_note_en IS 'Забележка към цената (EN) – показва се при избор на английски език';
