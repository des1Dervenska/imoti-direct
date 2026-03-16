-- =============================================================================
-- SUPABASE MIGRATIONS
-- =============================================================================
-- Изпълнявай всеки блок в Supabase SQL Editor (Dashboard → SQL Editor).
-- Подредбата е важна – изпълнявай по ред.
-- =============================================================================

-- =============================================================================
-- Migration 001: Газ и ТЕЦ (boolean колони за имоти)
-- =============================================================================
-- Описание: Добавя колони gaz (Газ) и tec (ТЕЦ) в таблица properties.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS gaz BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS tec BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN properties.gaz IS 'Имотът има газ';
COMMENT ON COLUMN properties.tec IS 'Имотът има ТЕЦ';

-- =============================================================================
-- Migration 002: Цена с/без ДДС (boolean)
-- =============================================================================
-- Описание: price_includes_vat = TRUE → цената е с включено ДДС; FALSE → без ДДС.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS price_includes_vat BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN properties.price_includes_vat IS 'TRUE = цена с включено ДДС, FALSE = цена без ДДС';

-- =============================================================================
-- Migration 003: Разширени типове имот (type)
-- =============================================================================
-- Описание: Разширява type с всички опции: едностаен, двустаен, ..., парцел, земеделска земя.
-- Съществуващи стойности apartment, house, land остават за обратна съвместимост.

ALTER TABLE properties ALTER COLUMN type TYPE VARCHAR(50);

ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_type_check;

ALTER TABLE properties ADD CONSTRAINT properties_type_check CHECK (type IN (
  'apartment', 'house', 'land',
  'ednostaen', 'destaen', 'tristaen', 'chetiristaen', 'mezonet', 'mezonet_ofis',
  'atelie', 'tavan', 'mnogostaen_penthaus', 'etaj_kashta', 'kashta', 'vila',
  'magazin', 'zavedenie', 'sklad', 'garaj', 'parkomqsto', 'promishleno',
  'hotel', 'parcel', 'zemedelska_zemya'
));

COMMENT ON COLUMN properties.type IS 'Тип имот: едностаен, двустаен, мезонет, къща, вила, парцел, и др.';

-- =============================================================================
-- Migration 004: Тип строителство (construction_type)
-- =============================================================================
-- Описание: Панел, Тухла, ЕПК, ПК, Гредоред, Сглобяема конструкция.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS construction_type VARCHAR(30) NULL;

ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_construction_type_check;
ALTER TABLE properties ADD CONSTRAINT properties_construction_type_check CHECK (
  construction_type IS NULL OR construction_type IN (
    'panel', 'tuhla', 'epk', 'pk', 'gredored', 'sglobyaema'
  )
);

COMMENT ON COLUMN properties.construction_type IS 'Тип строителство: Панел, Тухла, ЕПК, ПК, Гредоред, Сглобяема конструкция';

-- =============================================================================
-- Migration 005: Английски версии на текстови полета (двуезичност)
-- =============================================================================
-- Заглавие, Адрес, Квартал, Град, Описание, Удобства – по една колона за EN.
-- Град остава опън текст (VARCHAR); не се променя типът.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS title_en VARCHAR(500) NULL,
  ADD COLUMN IF NOT EXISTS address_en VARCHAR(500) NULL,
  ADD COLUMN IF NOT EXISTS neighborhood_en VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS city_en VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS description_en TEXT NULL,
  ADD COLUMN IF NOT EXISTS features_en TEXT[] NULL DEFAULT '{}';

COMMENT ON COLUMN properties.title_en IS 'Заглавие на английски';
COMMENT ON COLUMN properties.address_en IS 'Адрес на английски';
COMMENT ON COLUMN properties.neighborhood_en IS 'Квартал на английски';
COMMENT ON COLUMN properties.city_en IS 'Град на английски';
COMMENT ON COLUMN properties.description_en IS 'Описание на английски';
COMMENT ON COLUMN properties.features_en IS 'Удобства на английски (масив)';

-- =============================================================================
-- Migration 006: Година на строителство (статус + година)
-- =============================================================================
-- completed = ЗАВЪРШЕН (имот е въведен в експлоатация), year_built = година
-- under_construction = В СТРОЕЖ (ще бъде въведен), year_built = очаквана година
-- not_in_use = не е въведен в експлоатация (без година)

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS year_built_status VARCHAR(30) NULL;

ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_year_built_status_check;
ALTER TABLE properties ADD CONSTRAINT properties_year_built_status_check CHECK (
  year_built_status IS NULL OR year_built_status IN ('completed', 'under_construction', 'not_in_use')
);

COMMENT ON COLUMN properties.year_built_status IS 'Година на строителство: completed = завършен, under_construction = в строеж, not_in_use = не е въведен в експлоатация';

-- =============================================================================
-- Migration 007: Лична бележка на брокера (само за админ)
-- =============================================================================
-- Текст на български; вижда се само в админ панела, не се показва на клиенти.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS broker_note TEXT NULL;

COMMENT ON COLUMN properties.broker_note IS 'Лична бележка на брокера – само за админ, не се показва на сайта';

-- =============================================================================
-- Migration 008: YouTube видео за обект
-- =============================================================================
-- URL на YouTube видео; попълва се в админ, показва се като линк при клиента.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS video_url TEXT NULL;

COMMENT ON COLUMN properties.video_url IS 'URL на YouTube (или друго) видео за обекта – показва се при клиента като линк';

-- =============================================================================
-- (Следващи миграции ще се добавят тук по-долу)
-- =============================================================================
