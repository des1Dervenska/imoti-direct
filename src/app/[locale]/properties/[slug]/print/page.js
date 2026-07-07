import { notFound } from 'next/navigation';
import { getPropertyBySlug } from '@/lib/properties';
import { SITE_URL } from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import PropertyPrintContent from '@/components/property/PropertyPrintContent';
import PrintPageShell from '@/components/property/PrintPageShell';

export const dynamic = 'force-dynamic';

export default async function ClientPropertyPrintPage({ params }) {
  const { locale, slug } = await params;
  const property = await getPropertyBySlug(slug);
  const t = getTranslations(locale)?.property ?? {};

  if (!property) {
    notFound();
  }

  const prefix = `/${locale}`;
  const propertyPath = `${prefix}/properties/${slug}`;
  const listingUrl = `${SITE_URL}${propertyPath}`;
  const backHref = propertyPath;

  return (
    <PrintPageShell
      backHref={backHref}
      backLabel={locale === 'en' ? '← Back to listing' : '← Обратно към обявата'}
      printLabel={t.sharePrint ?? (locale === 'en' ? 'Print / Save as PDF' : 'Печат / Запази като PDF')}
    >
      <PropertyPrintContent property={property} locale={locale} listingUrl={listingUrl} />
    </PrintPageShell>
  );
}
