import { notFound } from 'next/navigation';
import { getPropertyBySlug, getDisplayText, getLocationLine } from '@/lib/properties';
import { SITE_URL } from '@/lib/constants';
import { buildPropertyPrintDocumentTitle } from '@/lib/property-print';
import { getTranslations } from '@/lib/translations';
import PropertyPrintContent from '@/components/property/PropertyPrintContent';
import PrintPageShell from '@/components/property/PrintPageShell';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return { title: 'Print' };
  }
  const display = getDisplayText(property, locale);
  const locationLine = getLocationLine(display);
  return {
    title: buildPropertyPrintDocumentTitle(display.title, locationLine),
  };
}

export default async function ClientPropertyPrintPage({ params }) {
  const { locale, slug } = await params;
  const property = await getPropertyBySlug(slug);
  const t = getTranslations(locale)?.property ?? {};

  if (!property) {
    notFound();
  }

  const display = getDisplayText(property, locale);
  const documentTitle = buildPropertyPrintDocumentTitle(display.title, getLocationLine(display));
  const prefix = `/${locale}`;
  const propertyPath = `${prefix}/properties/${slug}`;
  const listingUrl = `${SITE_URL}${propertyPath}`;
  const backHref = propertyPath;

  return (
    <PrintPageShell
      documentTitle={documentTitle}
      backHref={backHref}
      backLabel={locale === 'en' ? '← Back to listing' : '← Обратно към обявата'}
      printLabel={t.sharePrint ?? (locale === 'en' ? 'Print / Save as PDF' : 'Печат / Запази като PDF')}
    >
      <PropertyPrintContent property={property} locale={locale} listingUrl={listingUrl} />
    </PrintPageShell>
  );
}
