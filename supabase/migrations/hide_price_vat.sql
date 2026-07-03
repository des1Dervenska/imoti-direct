-- =============================================================================
-- Migration: hide_price_vat
-- =============================================================================
-- Пусни в Supabase Dashboard → SQL Editor
-- Добавя опция „Скрий с/без ДДС при показ“ за всяка обява.
-- =============================================================================

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS hide_price_vat BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN properties.hide_price_vat IS 'TRUE = не показвай с/без ДДС в клиентската част';
