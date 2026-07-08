import { propertyTypes } from '@/data/properties';
import {
  BRAND_NAME,
  CONTACT_PERSON,
  CONTACT_PERSON_EN,
  CONTACT_PHONE,
  CONTACT_EMAIL,
  SITE_WEBSITE,
  formatPriceEur,
} from '@/lib/constants';
import { getDisplayText, getLocationLine } from '@/lib/properties';
import { getTranslations } from '@/lib/translations';

const PRINT_BODY = 'text-base text-graphite font-sans leading-snug';
const PRINT_HEADING = 'text-lg font-semibold text-graphite font-sans';
const PRINT_PRICE = 'text-xl font-semibold text-cadetblue-dark font-sans';

export default function PropertyPrintContent({ property, locale = 'bg', listingUrl }) {
  const display = getDisplayText(property, locale);
  const locationLine = getLocationLine(display);
  const { title, description, features, priceNote } = display;
  const titleHasDigits = /\d/.test(String(title ?? ''));
  const t = getTranslations(locale);
  const tp = t.property;
  const {
    code,
    category,
    type,
    price,
    area,
    rooms,
    floor,
    totalFloors,
    yearBuilt,
    yearBuiltStatus,
    gaz,
    tec,
    hidePricePerSqm,
    hidePriceVat,
    constructionType,
    priceIncludesVat,
    images,
  } = property;

  const typeLabel = tp[type] ?? propertyTypes.find((opt) => opt.value === type)?.label ?? type;
  const categoryLabel = category === 'sale' ? (tp.sale ?? 'Продажба') : (tp.rent ?? 'Наем');
  const isEn = locale === 'en';
  const { eurText: rawEurText } = formatPriceEur(price, category);
  const eurText = isEn ? rawEurText.replace('/месец', '/month') : rawEurText;
  const pricePerSqm = !hidePricePerSqm && area > 0 ? Math.round((price ?? 0) / area) : null;
  const imageUrl = images?.[0] || '/images/placeholder-property.jpg';

  const yearBuiltLabel = yearBuiltStatus === 'completed' && yearBuilt
    ? `${tp.yearBuiltStatus_completed}, ${yearBuilt}`
    : yearBuiltStatus === 'under_construction' && yearBuilt
      ? `${tp.yearBuiltStatus_under_construction}, ${yearBuilt}`
      : yearBuiltStatus === 'not_in_use'
        ? tp.yearBuiltStatus_not_in_use
        : yearBuilt ?? '—';
  const constructionTypeLabel = constructionType
    ? (tp[`constructionType_${constructionType}`] ?? constructionType)
    : '—';

  const floorValue = floor != null && totalFloors != null
    ? `${floor === 0 ? tp.floorParter : floor} / ${totalFloors}`
    : floor != null
      ? (floor === 0 ? tp.floorParter : String(floor))
      : '—';

  const keyDetails = [
    { label: tp.area, value: area != null ? `${area} m²` : '—' },
    ...(!hidePricePerSqm ? [{ label: isEn ? 'Price/m²' : tp.pricePerSqm, value: pricePerSqm != null ? `${pricePerSqm} EUR/m²` : '—' }] : []),
    { label: tp.rooms, value: rooms != null ? String(rooms) : '—' },
    { label: tp.floor, value: floorValue },
    { label: tp.gaz, value: gaz ? tp.yes : (isEn ? 'No' : 'Не') },
    { label: tp.tec, value: tec ? tp.yes : (isEn ? 'No' : 'Не') },
    { label: tp.yearBuilt ?? tp.year, value: yearBuiltLabel },
    { label: tp.constructionType, value: constructionTypeLabel },
  ];

  const contactName = isEn ? CONTACT_PERSON_EN : CONTACT_PERSON;
  const contactsHeading = isEn ? 'Contacts:' : 'Контакти:';
  const listingLinkLabel = isEn ? 'Listing' : 'Обява';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 print:py-4 print:px-0 font-sans">
      <header className="mb-4 print:mb-3 text-center">
        <p className="text-base text-cadetblue tracking-wide brand-name-sans font-semibold">{BRAND_NAME}</p>
      </header>

      <article className="bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:rounded-none">
        <div className="relative h-64 bg-gray-200 overflow-hidden print:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2 z-20 text-sm font-sans">
            <span className="px-2.5 py-1 rounded-full bg-white/95 text-graphite shadow-sm">{categoryLabel}</span>
            <span className="px-2.5 py-1 rounded-full bg-cadetblue text-white shadow-sm">{typeLabel}</span>
          </div>
          {code != null && String(code).trim() !== '' && (
            <div className="absolute bottom-3 right-3 z-20 text-sm font-sans">
              <span className="px-2.5 py-1 rounded-full bg-white/95 text-graphite shadow-sm">
                {tp.listingCode}: {String(code).trim()}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 print:p-4 space-y-4 print:space-y-3">
          <div className="space-y-1">
            <h1
              className={`${titleHasDigits ? 'brand-name-sans ' : ''}${PRINT_PRICE} text-graphite`}
            >
              {title}
            </h1>
            <p className={`${PRINT_BODY} text-graphite-light`}>{locationLine}</p>
          </div>

          <div>
            <p className={PRINT_PRICE}>{eurText}</p>
            {priceIncludesVat != null && !hidePriceVat && (
              <p className="text-sm text-graphite-light font-sans">{priceIncludesVat ? tp.priceWithVat : tp.priceWithoutVat}</p>
            )}
            {priceNote && <p className={`${PRINT_BODY} text-graphite-light mt-1`}>{priceNote}</p>}
          </div>

          {listingUrl && (
            <p className={`${PRINT_BODY} print:hidden`}>
              {listingLinkLabel}:{' '}
              <a href={listingUrl} className="text-cadetblue-dark underline break-all">
                {listingUrl}
              </a>
            </p>
          )}

          <div className="property-print-key-details break-inside-avoid">
            <h2 className={`${PRINT_HEADING} mb-2`}>{tp.keyDetails}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 print:grid-cols-4 print:gap-1.5">
              {keyDetails.map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-lg px-3 py-2 print:py-1 print:px-2">
                  <p className="text-sm text-graphite-light font-sans">{label}</p>
                  <p className={`${PRINT_BODY} font-medium`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {description && (
            <div className="break-inside-avoid">
              <h2 className={`${PRINT_HEADING} mb-2`}>{tp.description}</h2>
              <p className={`${PRINT_BODY} whitespace-pre-line`}>{description}</p>
            </div>
          )}

          {features?.length > 0 && (
            <div className="break-inside-avoid">
              <h2 className={`${PRINT_HEADING} mb-2`}>{tp.features}</h2>
              <p className={PRINT_BODY}>{features.join(', ')}</p>
            </div>
          )}

          <div className="property-print-footer border-t-2 border-cadetblue/30 pt-5 mt-6 print:mt-8 print:pt-4 text-center">
            <p className={`${PRINT_HEADING} text-graphite mb-2`}>{contactsHeading}</p>
            <p className={`${PRINT_PRICE} text-cadetblue-dark font-semibold`}>{BRAND_NAME}</p>
            <p className={`${PRINT_BODY} font-medium text-graphite mt-2`}>{contactName}</p>
            <p className={`${PRINT_BODY} font-medium text-graphite mt-0.5`}>{CONTACT_PHONE}</p>
            <p className={`${PRINT_BODY} text-graphite-light mt-2 hidden print:block`}>
              {CONTACT_EMAIL} · {SITE_WEBSITE}
            </p>
            {listingUrl && (
              <p className={`text-sm text-graphite-light mt-2 hidden print:block`}>
                {listingLinkLabel}:{' '}
                <a href={listingUrl} className="text-cadetblue-dark underline break-all">
                  {listingUrl}
                </a>
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
