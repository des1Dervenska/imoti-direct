import { getPropertyById, getDisplayText, getLocationLine } from '@/lib/properties';
import { propertyTypes } from '@/data/properties';
import { formatPriceEur, BRAND_NAME, CONTACT_PERSON, CONTACT_PERSON_EN, CONTACT_PHONE, CONTACT_EMAIL } from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import Link from 'next/link';
import PrintButton from './PrintButton';

export const metadata = {
  title: 'Печат / PDF за клиент | Admin',
};

export default async function PrintPropertyPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const locale = sp?.lang === 'en' ? 'en' : 'bg';
  const { data: property, error } = await getPropertyById(id);
  const t = getTranslations(locale);
  const tp = t.property;

  if (error || !property) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">{tp.notFound}</p>
        <Link href="/admin/properties" className="text-blue-600 hover:underline">
          {locale === 'en' ? '← Back' : '← Обратно'}
        </Link>
      </div>
    );
  }

  const display = getDisplayText(property, locale);
  const locationLine = getLocationLine(display);
  const { title, description, features, priceNote } = display;
  const titleHasDigits = /\d/.test(String(title ?? ''));
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
    constructionType,
    priceIncludesVat,
    images,
  } = property;

  const typeLabel = tp[type] ?? propertyTypes.find((opt) => opt.value === type)?.label ?? type;
  const categoryLabel = category === 'sale' ? (tp.sale ?? 'Продажба') : (tp.rent ?? 'Наем');
  const { eurText: rawEurText } = formatPriceEur(price, category);
  const eurText = locale === 'en' ? rawEurText.replace('/месец', '/month') : rawEurText;
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
    ? (t?.property?.[`constructionType_${constructionType}`] ?? constructionType)
    : '—';

  return (
    <>
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <PrintButton label={locale === 'en' ? 'Print / Save as PDF' : 'Печат / Запази като PDF'} />
        <Link
          href={`/admin/properties/${id}/edit`}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-800"
        >
          {locale === 'en' ? 'Back to edit' : 'Обратно към редакция'}
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 print:py-6 print:px-0">
        <header className="mb-6 print:mb-4 text-center">
          <p className="text-sm text-cadetblue tracking-wide brand-name-sans">{BRAND_NAME}</p>
        </header>

        <article className="bg-white rounded-xl shadow-md overflow-hidden print:shadow-none print:rounded-none">
          {/* Снимка */}
          <div className="relative h-72 bg-gray-200 overflow-hidden print:h-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-graphite opacity-10" />
            <div className="absolute top-3 left-3 flex gap-2 z-20 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-white/95 text-graphite shadow-sm">{categoryLabel}</span>
              <span className="px-2.5 py-1 rounded-full bg-cadetblue text-white shadow-sm">{typeLabel}</span>
            </div>
            {code != null && String(code).trim() !== '' && (
              <div className="absolute bottom-3 right-3 z-20 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-white/95 text-graphite shadow-sm">
                  {(tp.listingCode ?? (locale === 'en' ? 'REF' : 'КОД'))}: {String(code).trim()}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 print:p-4 space-y-5 print:space-y-4">
            <div className="space-y-1">
              <h1
                className={`${titleHasDigits ? 'brand-name-sans ' : ''}text-2xl font-semibold text-graphite print:text-xl`}
              >
                {title}
              </h1>
              <p className="text-graphite-light text-sm">{locationLine}</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-cadetblue-dark">{eurText}</p>
              {priceIncludesVat != null && (
                <p className="text-xs text-graphite-light">{priceIncludesVat ? tp.priceWithVat : tp.priceWithoutVat}</p>
              )}
              {priceNote && <p className="text-sm text-graphite-light mt-1">{priceNote}</p>}
            </div>

            {/* Основни характеристики */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
              {[
                { label: tp.area, value: area != null ? `${area} m²` : '—' },
                ...(!hidePricePerSqm ? [{ label: locale === 'en' ? 'Price/m²' : 'Цена/м²', value: pricePerSqm != null ? `${pricePerSqm} EUR/m²` : '—' }] : []),
                { label: tp.rooms, value: rooms != null ? String(rooms) : '—' },
                { label: tp.floor, value: floor != null && totalFloors != null ? `${floor} / ${totalFloors}` : floor != null ? String(floor) : '—' },
                { label: tp.gaz, value: gaz ? tp.yes : (locale === 'en' ? 'No' : 'Не') },
                { label: tp.tec, value: tec ? tp.yes : (locale === 'en' ? 'No' : 'Не') },
                { label: tp.year, value: yearBuiltLabel },
                { label: tp.constructionType, value: constructionTypeLabel },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-lg px-3 py-2 print:py-1.5">
                  <p className="text-xs text-graphite-light">{label}</p>
                  <p className="text-sm font-medium text-graphite">{value}</p>
                </div>
              ))}
            </div>

            {description && (
              <div>
                <h2 className="text-base font-semibold text-graphite mb-2">{tp.description}</h2>
                <p className="text-graphite text-sm whitespace-pre-line">{description}</p>
              </div>
            )}

            {features?.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-graphite mb-2">{tp.features}</h2>
                <p className="text-graphite text-sm">{features.join(', ')}</p>
              </div>
            )}

            <footer className="border-t border-gray-200 pt-4 mt-2 text-sm text-graphite-light">
              <p>{locale === 'en' ? CONTACT_PERSON_EN : CONTACT_PERSON}</p>
              <p className="text-cadetblue-dark">{BRAND_NAME}</p>
              <p>{locale === 'en' ? 'Tel' : 'Тел'}: {CONTACT_PHONE}</p>
              <p>Email: {CONTACT_EMAIL}</p>
            </footer>
          </div>
        </article>
      </div>
    </>
  );
}
