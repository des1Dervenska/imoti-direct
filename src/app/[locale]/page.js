import HeroSection from "@/components/sections/HeroSection";
import HomePosterImage from "@/components/sections/HomePosterImage";
import { homePosterDesktopMaxHeightClass } from "@/lib/hero.config";
import { getHomePosters } from "@/lib/banners";
import { getTranslations } from "@/lib/translations";
import { BRAND_NAME, BRAND_DESCRIPTION, CONTACT_PHONE_LINK, CONTACT_EMAIL } from "@/lib/constants";
import Link from "next/link";
import { Section, Container, LinkButton, Card, FeatureCard, AnimateOnScroll } from "@/components/ui";
import {
  ShieldCheckIcon,
  BoltIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

/** Винаги свежи данни – нови обяви се показват веднага на началната страница. */
export const dynamic = 'force-dynamic';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.arthouse94.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const pageUrl = `${SITE_URL}/${locale}`;
  const title =
    locale === "en"
      ? `${BRAND_NAME} | Real Estate in Sofia and Bulgaria`
      : `${BRAND_NAME} | Недвижими имоти в София и България`;
  const description =
    locale === "en"
      ? `${BRAND_DESCRIPTION}. Buy, sell and rent apartments, houses and offices in Sofia and Bulgaria.`
      : `${BRAND_DESCRIPTION}. Покупка, продажба и наем на апартаменти, къщи и офиси в София и България.`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        bg: `${SITE_URL}/bg`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/bg`,
      },
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description,
      locale: locale === "en" ? "en_GB" : "bg_BG",
      alternateLocale: locale === "en" ? ["bg_BG"] : ["en_GB"],
      images: [{ url: `${SITE_URL}/images/logo.jpg`, alt: BRAND_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/images/logo.jpg`],
    },
    keywords: [
      locale === "en" ? "real estate" : "недвижими имоти",
      locale === "en" ? "property in sofia" : "имоти софия",
      locale === "en" ? "property for rent" : "имоти под наем",
      locale === "en" ? "property for sale" : "имоти за продажба",
      BRAND_NAME,
      t.home.heroTitle,
    ],
  };
}

export default async function Home({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const prefix = `/${locale}`;
  const { data: posters } = await getHomePosters();

  const posterRows = (posters || [])
    .slice(0, 3)
    .map((poster, idx) => {
      const imageUrl = (
        (locale === 'en' ? poster.imageUrlEn : poster.imageUrl) ||
        poster.imageUrl ||
        poster.imageUrlEn ||
        ''
      ).trim();
      const text = (locale === 'en' ? poster.textEn : poster.text) || poster.text || poster.textEn;
      const href = (locale === 'en' ? poster.linkUrlEn : poster.linkUrl) || poster.linkUrl || poster.linkUrlEn;
      return { poster, idx, imageUrl, text, href };
    })
    .filter((row) => Boolean(row.imageUrl));

  const features = [
    { title: t.home.security, description: t.home.securityDesc, icon: <ShieldCheckIcon className="w-8 h-8 text-graphite" /> },
    { title: t.home.speed, description: t.home.speedDesc, icon: <BoltIcon className="w-8 h-8 text-graphite" /> },
    { title: t.home.professionalism, description: t.home.professionalismDesc, icon: <UserGroupIcon className="w-8 h-8 text-graphite" /> },
    { title: t.home.fairPrices, description: t.home.fairPricesDesc, icon: <CurrencyDollarIcon className="w-8 h-8 text-graphite" /> },
  ];
  const pageUrl = `${SITE_URL}/${locale}`;
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: pageUrl,
    inLanguage: locale,
  };
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: BRAND_NAME,
    url: pageUrl,
    telephone: CONTACT_PHONE_LINK,
    email: CONTACT_EMAIL,
    areaServed: locale === "en" ? "Bulgaria" : "България",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroSection locale={locale} />

      {posterRows.length > 0 ? (
        <Section background="white">
          <Container>
            <div className="space-y-6 md:space-y-10">
              {posterRows.map(({ poster, idx, imageUrl, text, href }) => {
                const cardBody = (
                  <div className="mx-auto w-full max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:overflow-visible">
                    <div className="md:flex md:justify-center md:p-4 lg:p-5">
                      <div className="w-full min-w-0 md:flex md:w-fit md:max-w-full md:flex-col">
                        <HomePosterImage
                          src={imageUrl}
                          alt={text || `Poster ${idx + 1}`}
                          className={`block h-auto w-full max-h-80 object-cover sm:max-h-72 md:min-w-0 md:w-auto md:max-w-full md:object-contain md:object-center ${homePosterDesktopMaxHeightClass}`}
                        />
                        {text ? (
                          <div className="min-w-0 p-4 text-base text-graphite md:mt-4 md:w-full md:max-w-full md:border-t md:border-gray-100 md:pt-4 md:text-lg">
                            {text}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );

                return (
                  <AnimateOnScroll key={poster.position ?? idx} direction="up">
                    {href ? (
                      <Link href={href} className="block hover:opacity-95 transition-opacity">
                        {cardBody}
                      </Link>
                    ) : (
                      cardBody
                    )}
                  </AnimateOnScroll>
                );
              })}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section background="white">
        <Container>
          <AnimateOnScroll direction="down">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-graphite">{t.home.whyUsTitle}</h2>
              <p className="text-graphite-light mt-2">{t.home.whyUsSubtitle}</p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <AnimateOnScroll key={feature.title} direction="up">
                <FeatureCard
                  background="transparent"
                  hoverEffect="none"
                  {...feature}
                />
              </AnimateOnScroll>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="light">
        <Container>
          <AnimateOnScroll direction="up">
            <Card variant="outlined" className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-graphite mb-4">
                {t.home.ctaTitle}
              </h2>
              <p className="text-graphite-light mb-8 max-w-2xl mx-auto">
                {t.home.ctaBody}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LinkButton href={`${prefix}/contact`} variant="accent">
                  {t.home.contactUs}
                </LinkButton>
                <LinkButton href={`${prefix}/sales`} variant="accent-outline">
                  {t.home.viewProperties}
                </LinkButton>
              </div>
            </Card>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  );
}
