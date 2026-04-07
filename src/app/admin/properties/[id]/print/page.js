import { getPropertyById, getDisplayText, getLocationLine } from '@/lib/properties';
import { propertyTypes } from '@/data/properties';
import { formatPriceEur, BRAND_NAME, CONTACT_PERSON, CONTACT_PHONE, CONTACT_EMAIL } from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import Link from 'next/link';
import PrintButton from './PrintButton';

export const metadata = {
  title: 'Печат / PDF за клиент | Admin',
};

export default async function PrintPropertyPage({ params }) {
  const { id } = await params;
  const { data: property, error } = await getPropertyById(id);

  if (error || !property) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Имотът не е намерен.</p>
        <Link href="/admin/properties" className="text-blue-600 hover:underline">← Обратно</Link>
      </div>
    );
  }

  const locale = 'bg';
  const t = getTranslations(locale);
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

  const typeLabel = propertyTypes.find((opt) => opt.value === type)?.label ?? type;
  const categoryLabel = category === 'sale' ? (t?.property?.sale ?? 'Продажба') : (t?.property?.rent ?? 'Наем');
  const { eurText } = formatPriceEur(price, category);
  const pricePerSqm = !hidePricePerSqm && area > 0 ? Math.round((price ?? 0) / area) : null;
  const imageUrl = images?.[0] || '/images/placeholder-property.jpg';

  const yearBuiltLabel = yearBuiltStatus === 'completed' && yearBuilt
    ? `Завършен, ${yearBuilt}`
    : yearBuiltStatus === 'under_construction' && yearBuilt
      ? `В строеж, ${yearBuilt}`
      : yearBuiltStatus === 'not_in_use'
        ? 'Не е въведен в експлоатация'
        : yearBuilt ?? '—';
  const constructionTypeLabel = constructionType
    ? (t?.property?.[`constructionType_${constructionType}`] ?? constructionType)
    : '—';

  return (
    <>
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <PrintButton />
        <Link
          href={`/admin/properties/${id}/edit`}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-800"
        >
          Обратно към редакция
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 print:py-6 print:px-0">
        <header className="border-b border-gray-200 pb-4 mb-6 print:mb-4">
          <p className="text-sm text-gray-500">{BRAND_NAME}</p>
          <p className="text-xs text-gray-400 mt-1">Представяне за клиент – не е оферта</p>
        </header>

        <div className="space-y-6 print:space-y-4">
          {/* Снимка */}
          <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-64 object-cover print:h-52"
            />
          </div>

          {/* Категория / тип */}
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
              <p className="text-xs text-gray-500">{priceIncludesVat ? 'с включено ДДС' : 'без включено ДДС'}</p>
            )}
            {priceNote && <p className="text-sm text-gray-600 mt-1">{priceNote}</p>}
          </div>

          {/* Основни характеристики */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
            {[
              { label: 'Площ', value: area != null ? `${area} м²` : '—' },
              ...(!hidePricePerSqm ? [{ label: 'Цена/м²', value: pricePerSqm != null ? `${pricePerSqm} EUR/м²` : '—' }] : []),
              { label: 'Стаи', value: rooms != null ? String(rooms) : '—' },
              { label: 'Етаж', value: floor != null && totalFloors != null ? `${floor} / ${totalFloors}` : floor != null ? String(floor) : '—' },
              { label: 'Газ', value: gaz ? 'Да' : 'Не' },
              { label: 'ТЕЦ', value: tec ? 'Да' : 'Не' },
              { label: 'Година', value: yearBuiltLabel },
              { label: 'Тип строеж', value: constructionTypeLabel },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg px-3 py-2 print:py-1.5">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {description && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Описание</h2>
              <p className="text-gray-700 text-sm whitespace-pre-line">{description}</p>
            </div>
          )}

          {features?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Удобства</h2>
              <p className="text-gray-700 text-sm">{features.join(', ')}</p>
            </div>
          )}

          <footer className="border-t border-gray-200 pt-4 mt-6 text-sm text-gray-500">
            <p>{CONTACT_PERSON}</p>
            <p>{BRAND_NAME}</p>
            <p>Тел: {CONTACT_PHONE}</p>
            <p>Email: {CONTACT_EMAIL}</p>
          </footer>
        </div>
      </div>
    </>
  );
}
