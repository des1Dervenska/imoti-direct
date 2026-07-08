import { getPropertyById, getDisplayText, getLocationLine } from '@/lib/properties';
import { SITE_URL } from '@/lib/constants';
import { buildPropertyPrintDocumentTitle } from '@/lib/property-print';
import { getTranslations } from '@/lib/translations';
import Link from 'next/link';
import PropertyPrintContent from '@/components/property/PropertyPrintContent';
import PrintButton from '@/components/property/PrintButton';
import PrintDocumentTitle from '@/components/property/PrintDocumentTitle';

export async function generateMetadata({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const locale = sp?.lang === 'en' ? 'en' : 'bg';
  const { data: property } = await getPropertyById(id);
  if (!property) {
    return { title: 'Печат / PDF за клиент | Admin' };
  }
  const display = getDisplayText(property, locale);
  return {
    title: buildPropertyPrintDocumentTitle(display.title, getLocationLine(display)),
  };
}

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
  const documentTitle = buildPropertyPrintDocumentTitle(display.title, getLocationLine(display));
  const prefix = `/${locale}`;
  const listingUrl = property.slug ? `${SITE_URL}${prefix}/properties/${property.slug}` : null;

  return (
    <>
      <PrintDocumentTitle title={documentTitle} />
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <PrintButton label={locale === 'en' ? 'Print / Save as PDF' : 'Печат / Запази като PDF'} />
        <Link
          href={`/admin/properties/${id}/edit`}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-800"
        >
          {locale === 'en' ? 'Back to edit' : 'Обратно към редакция'}
        </Link>
      </div>
      <PropertyPrintContent property={property} locale={locale} listingUrl={listingUrl} />
    </>
  );
}
