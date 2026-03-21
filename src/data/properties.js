/**
 * =============================================================================
 * PROPERTY DATA MODEL - v1 (Simplified)
 * =============================================================================
 *
 * Опростен модел за v1, подготвен за Supabase.
 *
 * SUPABASE TABLE: properties
 *
 * =============================================================================
 */

// =============================================================================
// ENUMS / КОНСТАНТИ
// =============================================================================

export const PROPERTY_CATEGORY = {
  SALE: 'sale',
  RENT: 'rent',
};

export const PROPERTY_TYPE = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  LAND: 'land',
  // Разширени типове
  EDNOSTAEN: 'ednostaen',
  DESTAEN: 'destaen',
  TRISTAEN: 'tristaen',
  CHETIRISTAEN: 'chetiristaen',
  MEZONET: 'mezonet',
  MEZONET_OFIS: 'mezonet_ofis',
  ATELIE: 'atelie',
  TAVAN: 'tavan',
  MNOGOSTAEN_PENTHAUS: 'mnogostaen_penthaus',
  ETAJ_KASHTA: 'etaj_kashta',
  KASHTA: 'kashta',
  VILA: 'vila',
  MAGAZIN: 'magazin',
  ZAVEDENIE: 'zavedenie',
  SKLAD: 'sklad',
  GARAJ: 'garaj',
  PARKOMQSTO: 'parkomqsto',
  PROMISHLENO: 'promishleno',
  HOTEL: 'hotel',
  PARCEL: 'parcel',
  ZEMEDELSKA_ZEMYA: 'zemedelska_zemya',
};

export const PROPERTY_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SOLD: 'sold',
  RENTED: 'rented',
  INACTIVE: 'inactive',
};

export const CURRENCY = {
  EUR: 'EUR',
  BGN: 'BGN',
};

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * @typedef {Object} Property
 * @property {number} id - Primary key
 * @property {string} slug - URL-friendly идентификатор (unique)
 * @property {string|null} [code] - Вътрешен код (картички, търсене в админ)
 * @property {string} title - Заглавие
 * @property {string|null} [titleEn] - Заглавие (EN)
 * @property {('sale'|'rent')} category - Категория
 * @property {string} type - Тип имот (едностаен, двустаен, мезонет, къща, вила, парцел, и др.)
 * @property {('active'|'pending'|'sold'|'rented'|'inactive')} status - Статус
 * @property {number} price - Цена
 * @property {('EUR'|'BGN')} currency - Валута
 * @property {number} area - Площ в м²
 * @property {number|null} rooms - Брой стаи
 * @property {number|null} floor - Етаж
 * @property {number|null} totalFloors - Общо етажи
 * @property {number|null} yearBuilt - Година на строеж (при completed/under_construction)
 * @property {string|null} [yearBuiltStatus] - completed | under_construction | not_in_use
 * @property {string} city - Град
 * @property {string|null} [cityEn] - Град (EN)
 * @property {string|null} neighborhood - Квартал
 * @property {string|null} [neighborhoodEn] - Квартал (EN)
 * @property {string} address - Адрес
 * @property {string|null} [addressEn] - Адрес (EN)
 * @property {string} description - Описание
 * @property {string|null} [descriptionEn] - Описание (EN)
 * @property {string[]} features - Удобства
 * @property {string[]} [featuresEn] - Удобства (EN)
 * @property {string[]} images - Снимки (URLs)
 * @property {string|null} mapUrl - Google Maps линк
 * @property {string|null} [videoUrl] - Линк към YouTube (или друго) видео за обекта
 * @property {boolean} isFeatured - Промотирана обява
 * @property {boolean} [gaz] - Газ
 * @property {boolean} [tec] - ТЕЦ
 * @property {boolean} [priceIncludesVat] - Цена с включено ДДС (true) / без ДДС (false)
 * @property {string} [constructionType] - Тип строителство: panel, tuhla, epk, pk, gredored, sglobyaema
 * @property {string|null} [brokerNote] - Лична бележка на брокера (само за админ, не се показва на сайта)
 * @property {string|null} [priceNote] - Забележка цена (БГ) – показва се над Основни характеристики при клиента
 * @property {string|null} [priceNoteEn] - Забележка цена (EN) – показва се при английски език
 * @property {string} createdAt - ISO 8601
 * @property {string} updatedAt - ISO 8601
 */

// =============================================================================
// PROPERTIES DATA
// =============================================================================

/** @type {Property[]} */
export const properties = [
  {
    id: 1,
    slug: "apartament-sofia-lozenets",
    code: "AH-1001",
    title: "Тристаен апартамент в Лозенец",
    titleEn: "Three-room apartment in Lozenets",
    category: PROPERTY_CATEGORY.SALE,
    type: PROPERTY_TYPE.APARTMENT,
    status: PROPERTY_STATUS.ACTIVE,
    price: 185000,
    currency: CURRENCY.EUR,
    area: 95,
    rooms: 3,
    floor: 4,
    totalFloors: 8,
    yearBuilt: 2020,
    yearBuiltStatus: 'completed',
    city: "София",
    cityEn: "Sofia",
    neighborhood: "Лозенец",
    neighborhoodEn: "Lozenets",
    address: "ул. Златен рог 15, Лозенец, София",
    addressEn: "15 Zlaten Rog St, Lozenets, Sofia",
    description: "Просторен тристаен апартамент в престижния квартал Лозенец. Апартаментът разполага с просторен хол, две спални, модерна кухня и два балкона с прекрасна гледка към Витоша. Жилището е с луксозно обзавеждане и се продава напълно обзаведено.",
    descriptionEn: "Spacious three-room apartment in the prestigious Lozenets district. The apartment has a spacious hall, two bedrooms, a modern kitchen and two balconies with a beautiful view of Vitosha. The property is luxuriously furnished and sold fully furnished.",
    features: ["Паркомясто", "Асансьор", "Видеонаблюдение", "Климатик", "Панорамни прозорци"],
    featuresEn: ["Parking", "Elevator", "Access Control", "AC", "Panoramic windows"],
    images: ["/images/apartment-1.jpg", "/images/apartment-1-2.jpg"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=42.6697,23.3219",
    isFeatured: true,
    gaz: true,
    tec: false,
    priceIncludesVat: true,
    constructionType: 'tuhla',
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    slug: "kashta-plovdiv-kapana",
    code: "AH-1002",
    title: "Къща в центъра на Пловдив",
    category: PROPERTY_CATEGORY.SALE,
    type: PROPERTY_TYPE.HOUSE,
    status: PROPERTY_STATUS.ACTIVE,
    price: 320000,
    currency: CURRENCY.EUR,
    area: 220,
    rooms: 5,
    floor: null,
    totalFloors: 3,
    yearBuilt: 1925,
    city: "Пловдив",
    neighborhood: "Капана",
    address: "ул. Княз Церетелев 23, Капана, Пловдив",
    description: "Прекрасна реставрирана къща в сърцето на Капана. Запазена автентична архитектура, съчетана с модерни удобства. Три етажа с отделни входове, вътрешен двор и тераса на покрива. Идеална за семейство или инвестиция.",
    features: ["Собствен двор", "Тераса", "Реставрирана", "Централно отопление", "Гараж"],
    images: ["/images/house-1.jpg", "/images/house-1-2.jpg"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=42.1497,24.7510",
    isFeatured: true,
    gaz: false,
    tec: true,
    priceIncludesVat: false,
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
  },
  {
    id: 3,
    slug: "parcel-bansko",
    code: "AH-1003",
    title: "Парцел край Банско",
    category: PROPERTY_CATEGORY.SALE,
    type: PROPERTY_TYPE.LAND,
    status: PROPERTY_STATUS.ACTIVE,
    price: 45000,
    currency: CURRENCY.EUR,
    area: 1200,
    rooms: null,
    floor: null,
    totalFloors: null,
    yearBuilt: null,
    city: "Банско",
    neighborhood: null,
    address: "м. Св. Иван, Банско",
    description: "Равен парцел с прекрасна гледка към Пирин планина. Намира се на 3 км от ски лифта в Банско. Има достъп до ток и вода. Подходящ за строителство на къща за почивка или малък семеен хотел.",
    features: ["Ток", "Вода", "Асфалтов път", "Панорамна гледка", "Регулиран"],
    images: ["/images/land-1.jpg"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=41.8368,23.4882",
    isFeatured: false,
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-08T09:15:00Z",
  },
  {
    id: 4,
    slug: "apartament-varna-sea-garden",
    code: "AH-R201",
    title: "Двустаен апартамент с морска гледка",
    category: PROPERTY_CATEGORY.RENT,
    type: PROPERTY_TYPE.APARTMENT,
    status: PROPERTY_STATUS.ACTIVE,
    price: 800,
    currency: CURRENCY.EUR,
    area: 65,
    rooms: 2,
    floor: 6,
    totalFloors: 10,
    yearBuilt: 2018,
    city: "Варна",
    neighborhood: "Морска градина",
    address: "бул. Приморски 45, Варна",
    description: "Модерен двустаен апартамент с директна гледка към морето. Напълно обзаведен с дизайнерски мебели. На 200 метра от Морската градина и плажа. Включени паркомясто и интернет.",
    features: ["Морска гледка", "Паркомясто", "Басейн", "Фитнес", "Обзаведен"],
    images: ["/images/apartment-2.jpg", "/images/apartment-2-2.jpg"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=43.2076,27.9234",
    isFeatured: true,
    createdAt: "2024-01-20T11:45:00Z",
    updatedAt: "2024-01-20T11:45:00Z",
  },
  {
    id: 5,
    slug: "kashta-borovets-naem",
    code: "AH-R202",
    title: "Планинска къща в Боровец",
    category: PROPERTY_CATEGORY.RENT,
    type: PROPERTY_TYPE.HOUSE,
    status: PROPERTY_STATUS.ACTIVE,
    price: 150,
    currency: CURRENCY.EUR,
    area: 180,
    rooms: 4,
    floor: null,
    totalFloors: 2,
    yearBuilt: 2015,
    city: "Боровец",
    neighborhood: null,
    address: "ул. Ела 12, Боровец",
    description: "Уютна планинска къща за почивка в сърцето на Боровец. Четири спални, просторен хол с камина, напълно оборудвана кухня. Частен двор с барбекю и джакузи. На 500 метра от ски пистата.",
    features: ["Камина", "Джакузи", "Барбекю", "Паркинг", "WiFi"],
    images: ["/images/house-2.jpg", "/images/house-2-2.jpg"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=42.2667,23.6000",
    isFeatured: false,
    createdAt: "2024-01-18T16:20:00Z",
    updatedAt: "2024-01-18T16:20:00Z",
  },
  {
    id: 6,
    slug: "apartament-burgas-naem",
    code: "AH-R203",
    title: "Студио в центъра на Бургас",
    category: PROPERTY_CATEGORY.RENT,
    type: PROPERTY_TYPE.APARTMENT,
    status: PROPERTY_STATUS.ACTIVE,
    price: 400,
    currency: CURRENCY.EUR,
    area: 35,
    rooms: 1,
    floor: 2,
    totalFloors: 5,
    yearBuilt: 2010,
    city: "Бургас",
    neighborhood: "Център",
    address: "ул. Александровска 78, Бургас",
    description: "Компактно и функционално студио в центъра на Бургас. Напълно обзаведено, подходящо за студенти или млади професионалисти. Близо до университета и централните улици за пазаруване.",
    features: ["Обзаведено", "Климатик", "Интернет", "Централна локация"],
    images: ["/images/apartment-3.jpg"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=42.5048,27.4626",
    isFeatured: false,
    createdAt: "2024-01-22T08:00:00Z",
    updatedAt: "2024-01-22T08:00:00Z",
  },
  {
    id: 7,
    slug: "parcel-sozopol",
    code: "AH-1004",
    title: "Парцел близо до Созопол",
    category: PROPERTY_CATEGORY.SALE,
    type: PROPERTY_TYPE.LAND,
    status: PROPERTY_STATUS.ACTIVE,
    price: 85000,
    currency: CURRENCY.EUR,
    area: 800,
    rooms: null,
    floor: null,
    totalFloors: null,
    yearBuilt: null,
    city: "Созопол",
    neighborhood: "Буджака",
    address: "м. Буджака, Созопол",
    description: "Атрактивен парцел на 2 км от Созопол с частична морска гледка. Регулиран, със строителни права за жилищна сграда до 3 етажа. Идеална инвестиция за ваканционен имот край морето.",
    features: ["Морска гледка", "Строителни права", "Регулиран", "Вода", "Ток"],
    images: ["/images/land-2.jpg"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=42.4167,27.6958",
    isFeatured: false,
    createdAt: "2024-01-12T13:10:00Z",
    updatedAt: "2024-01-12T13:10:00Z",
  },
  {
    id: 8,
    slug: "apartament-sofia-mladost",
    code: "AH-1005",
    title: "Четиристаен апартамент в Младост",
    category: PROPERTY_CATEGORY.SALE,
    type: PROPERTY_TYPE.APARTMENT,
    status: PROPERTY_STATUS.ACTIVE,
    price: 220000,
    currency: CURRENCY.EUR,
    area: 120,
    rooms: 4,
    floor: 7,
    totalFloors: 12,
    yearBuilt: 2022,
    city: "София",
    neighborhood: "Младост 4",
    address: "бул. Александър Малинов 85, Младост 4, София",
    description: "Нов четиристаен апартамент в луксозен комплекс в Младост 4. Три спални, просторен хол с трапезария, две бани, голям балкон. Подземен гараж и охраняем комплекс с детска площадка.",
    features: ["Гараж", "Охрана", "Детска площадка", "Ново строителство", "Луксозен"],
    images: ["/images/apartment-4.jpg", "/images/apartment-4-2.jpg"],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=42.6350,23.3750",
    isFeatured: true,
    createdAt: "2024-01-25T15:30:00Z",
    updatedAt: "2024-01-25T15:30:00Z",
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Намира имот по slug
 */
export function getPropertyBySlug(slug) {
  return properties.find(p => p.slug === slug);
}

/**
 * Връща активни имоти за продажба
 */
export function getSaleProperties() {
  return properties.filter(p =>
    p.category === PROPERTY_CATEGORY.SALE &&
    p.status === PROPERTY_STATUS.ACTIVE
  );
}

/**
 * Връща активни имоти под наем
 */
export function getRentProperties() {
  return properties.filter(p =>
    p.category === PROPERTY_CATEGORY.RENT &&
    p.status === PROPERTY_STATUS.ACTIVE
  );
}

/**
 * Връща промотирани имоти
 */
export function getFeaturedProperties() {
  return properties.filter(p =>
    p.isFeatured &&
    p.status === PROPERTY_STATUS.ACTIVE
  );
}

/**
 * Търсене с филтри
 */
export function searchProperties(filters = {}) {
  const { category, type, city, minPrice, maxPrice, minArea, maxArea, rooms } = filters;

  return properties.filter(p => {
    if (p.status !== PROPERTY_STATUS.ACTIVE) return false;
    if (category && p.category !== category) return false;
    if (type && p.type !== type) return false;
    if (city && p.city !== city) return false;
    if (minPrice && p.price < minPrice) return false;
    if (maxPrice && p.price > maxPrice) return false;
    if (minArea && p.area < minArea) return false;
    if (maxArea && p.area > maxArea) return false;
    if (rooms && p.rooms !== rooms) return false;
    return true;
  });
}

// =============================================================================
// FORMAT HELPERS
// =============================================================================

/**
 * Форматира цена
 */
export function formatPrice(price, currency = CURRENCY.EUR, category = PROPERTY_CATEGORY.SALE) {
  const formatted = new Intl.NumberFormat('bg-BG').format(price);
  const suffix = category === PROPERTY_CATEGORY.RENT ? '/месец' : '';
  return `${formatted} ${currency}${suffix}`;
}

/**
 * Връща label за тип имот (български – за админ и fallback)
 */
export function getTypeLabel(type) {
  const opt = propertyTypes.find((t) => t.value === type);
  return opt ? opt.label : type;
}

/**
 * Връща label за категория
 */
export function getConstructionTypeLabel(type) {
  const opt = constructionTypes.find((t) => t.value === type);
  return opt ? opt.label : type || '';
}

export function getCategoryLabel(category) {
  const labels = {
    [PROPERTY_CATEGORY.SALE]: 'Продажба',
    [PROPERTY_CATEGORY.RENT]: 'Наем',
  };
  return labels[category] || category;
}

// =============================================================================
// UI OPTIONS - За филтри и форми
// =============================================================================

export const propertyTypes = [
  { value: 'ednostaen', label: 'Едностаен' },
  { value: 'destaen', label: 'Двустаен' },
  { value: 'tristaen', label: 'Тристаен' },
  { value: 'chetiristaen', label: 'Четиристаен' },
  { value: 'mezonet', label: 'Мезонет' },
  { value: 'mezonet_ofis', label: 'Офис' },
  { value: 'atelie', label: 'Ателие' },
  { value: 'tavan', label: 'Таван' },
  { value: 'mnogostaen_penthaus', label: 'Многостаен/Пентхаус' },
  { value: 'etaj_kashta', label: 'Етаж от къща' },
  { value: 'kashta', label: 'Къща' },
  { value: 'vila', label: 'Вила' },
  { value: 'magazin', label: 'Магазин' },
  { value: 'zavedenie', label: 'Заведение' },
  { value: 'sklad', label: 'Склад' },
  { value: 'garaj', label: 'Гараж' },
  { value: 'parkomqsto', label: 'Паркомясто' },
  { value: 'promishleno', label: 'Промишлено помещение' },
  { value: 'hotel', label: 'Хотел' },
  { value: 'parcel', label: 'Парцел' },
  { value: 'zemedelska_zemya', label: 'Земеделска земя' },
  // Обратна съвместимост
  { value: PROPERTY_TYPE.APARTMENT, label: 'Апартамент' },
  { value: PROPERTY_TYPE.HOUSE, label: 'Къща' },
  { value: PROPERTY_TYPE.LAND, label: 'Парцел' },
];

export const propertyCategories = [
  { value: PROPERTY_CATEGORY.SALE, label: 'Продажба' },
  { value: PROPERTY_CATEGORY.RENT, label: 'Наем' },
];

export const propertyStatuses = [
  { value: PROPERTY_STATUS.ACTIVE, label: 'Активна' },
  { value: PROPERTY_STATUS.PENDING, label: 'Чакаща' },
  { value: PROPERTY_STATUS.SOLD, label: 'Продадена' },
  { value: PROPERTY_STATUS.RENTED, label: 'Отдадена' },
  { value: PROPERTY_STATUS.INACTIVE, label: 'Блокирана' },
];

export const constructionTypes = [
  { value: 'panel', label: 'Панел' },
  { value: 'tuhla', label: 'Тухла' },
  { value: 'epk', label: 'ЕПК' },
  { value: 'pk', label: 'ПК' },
  { value: 'gredored', label: 'Гредоред' },
  { value: 'sglobyaema', label: 'Сглобяема конструкция' },
];

/** Година на строителство: завършен / в строеж / не е въведен в експлоатация */
export const yearBuiltStatuses = [
  { value: 'completed', label: 'ЗАВЪРШЕН – имотът е въведен в експлоатация' },
  { value: 'under_construction', label: 'В СТРОЕЖ – имотът ще бъде въведен в експлоатация' },
  { value: 'not_in_use', label: 'Имотът не е въведен в експлоатация' },
];

export function getYearBuiltStatusLabel(status) {
  const found = yearBuiltStatuses.find((s) => s.value === status);
  return found ? found.label : '';
}

/** Удобства – опции за чекбокси в админ (български + английски) */
export const FEATURE_OPTIONS = [
  { bg: 'Паркомясто', en: 'Parking' },
  { bg: 'Асансьор', en: 'Elevator' },
  { bg: 'Видеонаблюдение', en: 'Access Control' },
  { bg: 'Климатик', en: 'AC' },
  { bg: 'Панорамни прозорци', en: 'Panoramic windows' },
  { bg: 'С преход', en: 'With hallway' },
  { bg: 'С гараж', en: 'With garage' },
  { bg: 'С паркинг', en: 'With parking' },
  { bg: 'Интернет връзка', en: 'Internet connection' },
  { bg: 'С действащ бизнес', en: 'With operating business' },
  { bg: 'Обзаведен', en: 'Furnished' },
  { bg: 'Контрол на достъпа', en: 'Access control' },
  { bg: 'Охрана', en: 'Security' },
  { bg: 'Саниран', en: 'Renovated' },
  { bg: 'В затворен комплекс', en: 'In gated complex' },
  { bg: 'За ремонт', en: 'For renovation' },
  { bg: 'Възможност за дан. кредит', en: 'Mortgage possible' },
  { bg: 'Собствен двор', en: 'Private yard' },
  { bg: 'Тераса', en: 'Terrace' },
  { bg: 'Централно отопление', en: 'Central heating' },
  { bg: 'Гараж', en: 'Garage' },
  { bg: 'Ток', en: 'Electricity' },
  { bg: 'Вода', en: 'Water' },
  { bg: 'Асфалтов път', en: 'Paved road' },
  { bg: 'Панорамна гледка', en: 'Panoramic view' },
  { bg: 'Регулиран', en: 'Regulated' },
  { bg: 'Морска гледка', en: 'Sea view' },
  { bg: 'Басейн', en: 'Swimming pool' },
  { bg: 'Фитнес', en: 'Fitness' },
  { bg: 'Камина', en: 'Fireplace' },
  { bg: 'Джакузи', en: 'Jacuzzi' },
  { bg: 'Барбекю', en: 'Barbecue' },
  { bg: 'WiFi', en: 'WiFi' },
  { bg: 'Интернет', en: 'Internet' },
  { bg: 'Централна локация', en: 'Central location' },
  { bg: 'Строителни права', en: 'Building rights' },
  { bg: 'Детска площадка', en: 'Playground' },
  { bg: 'Ново строителство', en: 'New construction' },
  { bg: 'Луксозен', en: 'Luxury' },
];

export const cities = [
  { value: 'София', label: 'София' },
  { value: 'Пловдив', label: 'Пловдив' },
  { value: 'Варна', label: 'Варна' },
  { value: 'Бургас', label: 'Бургас' },
  { value: 'Банско', label: 'Банско' },
  { value: 'Боровец', label: 'Боровец' },
  { value: 'Созопол', label: 'Созопол' },
];
