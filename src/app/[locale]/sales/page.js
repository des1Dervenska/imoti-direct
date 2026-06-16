import PropertyFilters from "@/components/property/PropertyFilters";
import { getSaleProperties } from "@/lib/properties";
import { BRAND_NAME } from "@/lib/constants";
import { getTranslations } from "@/lib/translations";
import { Section, Container, LinkButton, Card, AnimateOnScroll } from "@/components/ui";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

/** Винаги свежи данни от Supabase – нови обяви се показват веднага (без кеш на страницата). */
export const dynamic = 'force-dynamic';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.arthouse94.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const pageUrl = `${SITE_URL}/${locale}/sales`;
  const description =
    locale === "en"
      ? "Browse our current listings for sale: apartments, houses and land in Bulgaria."
      : "Разгледайте нашите актуални оферти за продажба на апартаменти, къщи и парцели в България.";
  return {
    title: `${t.sales.title} | ${BRAND_NAME}`,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        bg: `${SITE_URL}/bg/sales`,
        en: `${SITE_URL}/en/sales`,
        "x-default": `${SITE_URL}/bg/sales`,
      },
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: `${t.sales.title} | ${BRAND_NAME}`,
      description,
      locale: locale === "en" ? "en_GB" : "bg_BG",
      alternateLocale: locale === "en" ? ["bg_BG"] : ["en_GB"],
    },
    twitter: {
      card: "summary",
      title: `${t.sales.title} | ${BRAND_NAME}`,
      description,
    },
    keywords: [
      locale === "en" ? "properties for sale" : "имоти за продажба",
      locale === "en" ? "apartments for sale" : "апартаменти за продажба",
      locale === "en" ? "houses for sale" : "къщи за продажба",
      locale === "en" ? "property sofia" : "имоти софия",
      BRAND_NAME,
    ],
  };
}

export default async function SalesPage({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const prefix = `/${locale}`;
  const properties = await getSaleProperties();
  const pageUrl = `${SITE_URL}/${locale}/sales`;
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${t.sales.title} | ${BRAND_NAME}`,
    url: pageUrl,
    itemListElement: properties.slice(0, 30).map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/${locale}/properties/${property.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <AnimateOnScroll direction="down" className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-cadetblue mb-3 tracking-wide [text-shadow:0_1px_2px_rgba(0,151,178,0.25)]">
              {t.sales.title}
            </h1>
            <p className="text-graphite-light max-w-xl mx-auto">
              {(() => {
                const [before, ...rest] = t.sales.subtitleWithCount.split('{count}');
                const after = rest.join('{count}');
                return <>{before}<span>{properties.length}</span>{after}</>;
              })()}
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>

      <PropertyFilters
        properties={properties}
        emptyMessage={t.sales.emptyMessage}
        animateCards
        locale={locale}
      />

      <Section background="white" padding="md">
        <Container>
          <AnimateOnScroll direction="up">
            <Card variant="outlined" className="bg-gray-50 p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-graphite mb-4">
                {t.sales.ctaTitle}
              </h2>
              <p className="text-graphite-light mb-6 max-w-xl mx-auto">
                {t.sales.ctaBody}
              </p>
              <LinkButton href={`${prefix}/contact`} variant="accent">
                {t.home.contactUs}
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </LinkButton>
            </Card>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  );
}
