import PropertyFilters from "@/components/property/PropertyFilters";
import { getRentProperties } from "@/lib/properties";
import { BRAND_NAME } from "@/lib/constants";
import { getTranslations } from "@/lib/translations";
import { Section, Container, LinkButton, Card, FeatureCard, AnimateOnScroll } from "@/components/ui";
import {
  CheckCircleIcon,
  LockClosedIcon,
  LifebuoyIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: `${t.rent.title} | ${BRAND_NAME}`,
    description:
      locale === "en"
        ? "Browse our current rental listings: apartments and houses in Bulgaria."
        : "Разгледайте нашите актуални оферти за наем на апартаменти и къщи в България.",
  };
}

export default async function RentPage({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const prefix = `/${locale}`;
  const properties = await getRentProperties();

  const infoCards = [
    { title: t.rent.card1Title, description: t.rent.card1Desc, icon: <CheckCircleIcon className="w-7 h-7 text-graphite" /> },
    { title: t.rent.card2Title, description: t.rent.card2Desc, icon: <LockClosedIcon className="w-7 h-7 text-graphite" /> },
    { title: t.rent.card3Title, description: t.rent.card3Desc, icon: <LifebuoyIcon className="w-7 h-7 text-graphite" /> },
  ];

  return (
    <>
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <AnimateOnScroll direction="down" className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-cadetblue mb-3 tracking-wide [text-shadow:0_1px_2px_rgba(0,151,178,0.25)]">
              {t.rent.title}
            </h1>
            <p className="text-graphite-light max-w-xl mx-auto">
              {(() => {
                const [before, ...rest] = t.rent.subtitleWithCount.split('{count}');
                const after = rest.join('{count}');
                return <>{before}<span className="font-sans-nums">{properties.length}</span>{after}</>;
              })()}
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>

      <PropertyFilters
        properties={properties}
        category="rent"
        emptyMessage={t.rent.emptyMessage}
        animateCards
        locale={locale}
      />

      <Section background="white" padding="md">
        <Container>
          <AnimateOnScroll direction="up">
            <FeatureCard.Grid columns={3}>
              {infoCards.map((card) => (
                <FeatureCard
                  key={card.title}
                  background="light"
                  hoverEffect="lift"
                  {...card}
                />
              ))}
            </FeatureCard.Grid>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section background="light" padding="md">
        <Container>
          <AnimateOnScroll direction="up">
            <Card variant="outlined" className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-graphite mb-4">
                {t.rent.ctaTitle}
              </h2>
              <p className="text-graphite-light mb-6 max-w-xl mx-auto">
                {t.rent.ctaBody}
              </p>
              <LinkButton href={`${prefix}/contact`} variant="accent">
                {t.home.contactUs}
                <ArrowRightIcon className="w-5 h-5" />
              </LinkButton>
            </Card>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  );
}
