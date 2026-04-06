import { getPropertyById, getDisplayText, getLocationLine } from '@/lib/properties';
import { propertyTypes } from '@/data/properties';
import { formatPriceEur, BRAND_NAME, BRAND_NAME_COMPACT, CONTACT_PERSON, CONTACT_PHONE, CONTACT_EMAIL } from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import Link from 'next/link';
import PrintButton from './PrintButton';

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const locale = sp?.lang === 'en' || sp?.locale === 'en' ? 'en' : 'bg';
  const t = getTranslations(locale);
  return {
    title: `${t.adminPrint.pageTitle} | Admin`,
  };
}

export default async function PrintPropertyPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const locale = sp?.lang === 'en' || sp?.locale === 'en' ? 'en' : 'bg';
  const t = getTranslations(locale);
  const tp = t.property;
  const ap = t.adminPrint;

  const { data: property, error } = await getPropertyById(id);

  if (error || !property) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">{ap.notFound}</p>
        <Link href="/admin/properties" className="text-blue-600 hover:underline">{ap.back}</Link>
      </div>
    );
  }

  const display = getDisplayText(property, locale);
  const locationLine = getLocationLine(display);
  const { title, description, features, priceNote } = display;
  const titleHasDigits = /\d/.test(String(title ?? ''));
  const {
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
  const { eurText } = formatPriceEur(price, category, locale);
  const pricePerSqm = !hidePricePerSqm && area > 0 ? Math.round((price ?? 0) / area) : null;
  const imageUrl = images?.[0] || '/images/placeholder-property.jpg';

  let yearBuiltLabel = '—';
  if (yearBuiltStatus === 'completed' && yearBuilt) {
    yearBuiltLabel = `${tp.yearBuiltStatus_completed}, ${yearBuilt}`;
  } else if (yearBuiltStatus === 'under_construction' && yearBuilt) {
    yearBuiltLabel = `${tp.yearBuiltStatus_under_construction}, ${yearBuilt}`;
  } else if (yearBuiltStatus === 'not_in_use') {
    yearBuiltLabel = tp.yearBuiltStatus_not_in_use;
  } else if (yearBuilt != null) {
    yearBuiltLabel = String(yearBuilt);
  }

  const constructionTypeLabel = constructionType
    ? (tp[`constructionType_${constructionType}`] ?? constructionType)
    : '—';

  const yesNo = (v) => (v ? ap.yes : ap.no);

  return (
    <>
      <div className="print:hidden fixed top-4 left-4 right-4 z-50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/admin/properties/${id}/print`}
            className={locale === 'bg' ? 'font-semibold text-gray-900' : 'text-blue-600 hover:underline'}
          >
            BG
          </Link>
          <span className="text-gray-300" aria-hidden>|</span>
          <Link
            href={`/admin/properties/${id}/print?lang=en`}
            className={locale === 'en' ? 'font-semibold text-gray-900' : 'text-blue-600 hover:underline'}
          >
            EN
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <PrintButton label={ap.printButton} />
          <Link
            href={`/admin/properties/${id}/edit`}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-800"
          >
            {ap.backToEdit}
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 print:py-6 print:px-0">
        <header className="border-b border-gray-200 pb-4 mb-6 print:mb-4">
          <p className="text-sm text-gray-600">
            {ap.clientDisclaimer.replace(/\{brand\}/g, BRAND_NAME_COMPACT)}
          </p>
        </header>

        <div className="space-y-6 print:space-y-4">
          <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-64 object-cover print:h-52"
            />
          </div>

          <div className="flex gap-2 text-sm">
            <span className="px-2 py-1 bg-gray-100 rounded">{categoryLabel}</span>
            <span className="px-2 py-1 bg-gray-100 rounded">{typeLabel}</span>
          </div>

          <h1
            className={`${titleHasDigits ? 'brand-name-sans ' : ''}text-2xl font-semibold text-gray-900 print:text-xl`}
          >
            {title}
          </h1>
          <p className="text-gray-600">{locationLine}</p>
          <div>
            <p className="text-xl font-semibold text-gray-900">{eurText}</p>
            {priceIncludesVat != null && (
              <p className="text-xs text-gray-500">{priceIncludesVat ? tp.priceWithVat : tp.priceWithoutVat}</p>
            )}
            {priceNote && <p className="text-sm text-gray-600 mt-1">{priceNote}</p>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
            {[
              { label: tp.area, value: area != null ? `${area} m²` : '—' },
              ...(!hidePricePerSqm ? [{ label: ap.pricePerSqmShort, value: pricePerSqm != null ? `${pricePerSqm} EUR/m²` : '—' }] : []),
              { label: tp.rooms, value: rooms != null ? String(rooms) : '—' },
              { label: tp.floor, value: floor != null && totalFloors != null ? `${floor} / ${totalFloors}` : floor != null ? String(floor) : '—' },
              { label: tp.gaz, value: yesNo(gaz) },
              { label: tp.tec, value: yesNo(tec) },
              { label: tp.year, value: yearBuiltLabel },
              { label: tp.constructionType, value: constructionTypeLabel },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg px-3 py-2 print:py-1.5">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {description && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">{tp.description}</h2>
              <p className="text-gray-700 text-sm whitespace-pre-line">{description}</p>
            </div>
          )}

          {features?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">{tp.features}</h2>
              <p className="text-gray-700 text-sm">{features.join(', ')}</p>
            </div>
          )}

          <footer className="border-t border-gray-200 pt-4 mt-6 text-sm text-gray-500">
            <p>{CONTACT_PERSON}</p>
            <p>{BRAND_NAME}</p>
            <p>{ap.telPrefix} {CONTACT_PHONE}</p>
            <p>{ap.emailPrefix} {CONTACT_EMAIL}</p>
          </footer>
        </div>
      </div>
    </>
  );
}
