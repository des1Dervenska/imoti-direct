import { BRAND_NAME } from '@/lib/constants';

/**
 * Заглавие на print/PDF страницата и предложено име на файла.
 * Пример: „СЕМЕЕН ХОТЕЛ/069 - гр. Приморско, Стария квартал-носът _ ART HOUSE 94“
 */
export function buildPropertyPrintDocumentTitle(title, locationLine, brandName = BRAND_NAME) {
  const cleanTitle = String(title ?? '').replace(/\s+/g, ' ').trim();
  const cleanLocation = String(locationLine ?? '').replace(/\s+/g, ' ').trim();
  const headline = [cleanTitle, cleanLocation].filter(Boolean).join(' - ');
  const full = headline ? `${headline} _ ${brandName}` : brandName;
  return full.replace(/[<>:"\\|?*]/g, '-').trim();
}
