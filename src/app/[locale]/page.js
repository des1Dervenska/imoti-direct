import HeroSection from "@/components/sections/HeroSection";
import PropertyCarousel from "@/components/property/PropertyCarousel";
import { getSaleProperties, getRentProperties } from "@/lib/properties";
import { getTranslations } from "@/lib/translations";
import Link from "next/link";
import { Section, Container, LinkButton, Card, FeatureCard, AnimateOnScroll } from "@/components/ui";
import {
  ShieldCheckIcon,
  BoltIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

function SectionHeader({ title, subtitle, href, linkText }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl font-bold text-graphite">{title}</h2>
        <p className="text-graphite-light mt-2">{subtitle}</p>
      </div>
      {href && (
        <Link
          href={href}
          className="hidden sm:flex items-center text-graphite hover:text-graphite-dark font-medium"
        >
          {linkText}
          <ChevronRightIcon className="w-5 h-5 ml-1" />
        </Link>
      )}
    </div>
  );
}

function MobileLink({ href, children }) {
  return (
    <div className="mt-8 text-center sm:hidden">
      <Link
        href={href}
        className="inline-flex items-center text-graphite hover:text-graphite-dark font-medium"
      >
        {children}
        <ChevronRightIcon className="w-5 h-5 ml-1" />
      </Link>
    </div>
  );
}

export default async function Home({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const prefix = `/${locale}`;

  const allSaleProperties = await getSaleProperties();
  const allRentProperties = await getRentProperties();
  const salePropertiesForCarousel = allSaleProperties.slice(0, 12);
  const rentPropertiesForCarousel = allRentProperties.slice(0, 12);

  const features = [
    { title: t.home.security, description: t.home.securityDesc, icon: <ShieldCheckIcon className="w-8 h-8 text-graphite" /> },
    { title: t.home.speed, description: t.home.speedDesc, icon: <BoltIcon className="w-8 h-8 text-graphite" /> },
    { title: t.home.professionalism, description: t.home.professionalismDesc, icon: <UserGroupIcon className="w-8 h-8 text-graphite" /> },
    { title: t.home.fairPrices, description: t.home.fairPricesDesc, icon: <CurrencyDollarIcon className="w-8 h-8 text-graphite" /> },
  ];

  return (
    <div className="font-playfair">
      <HeroSection locale={locale} />

      <Section background="white">
        <Container>
          <AnimateOnScroll direction="down">
            <SectionHeader
              title={t.home.saleTitle}
              subtitle={t.home.saleSubtitle}
              href={`${prefix}/sales`}
              linkText={t.home.viewAll}
            />
          </AnimateOnScroll>
          <AnimateOnScroll direction="up">
            <PropertyCarousel properties={salePropertiesForCarousel} locale={locale} />
            <MobileLink href={`${prefix}/sales`}>{t.home.viewAllSales}</MobileLink>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section background="light">
        <Container>
          <AnimateOnScroll direction="down">
            <SectionHeader
              title={t.home.rentTitle}
              subtitle={t.home.rentSubtitle}
              href={`${prefix}/rent`}
              linkText={t.home.viewAll}
            />
          </AnimateOnScroll>
          <AnimateOnScroll direction="up">
            <PropertyCarousel properties={rentPropertiesForCarousel} locale={locale} />
            <MobileLink href={`${prefix}/rent`}>{t.home.viewAllRent}</MobileLink>
          </AnimateOnScroll>
        </Container>
      </Section>

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
    </div>
  );
}
