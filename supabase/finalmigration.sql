-- =============================================================================
-- Migration 010 (FINAL): Скриване на цена на квадратен метър
-- =============================================================================
-- hide_price_per_sqm = TRUE -> цената на м² не се показва в клиентската част.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS hide_price_per_sqm BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN properties.hide_price_per_sqm IS 'TRUE = не показвай цена на м² в клиентската част за този имот';
