import {
  BRAND_NAME,
  CONTACT_PERSON,
} from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import { Section, Container, Card, LinkButton, FeatureCard, AnimateOnScroll } from '@/components/ui';
import {
  HomeIcon,
  KeyIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: `${t.about.title} | ${BRAND_NAME}`,
    description: `${BRAND_NAME} - ${t.brand.description}. ${t.brand.tagline}.`,
  };
}

function OwnerCard({ name, brandName, ownerRole }) {
  return (
    <div className="mt-8 p-6 bg-graphite/5 rounded-xl">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 shrink-0 rounded-full overflow-hidden bg-cadetblue/15 ring-2 ring-white shadow-md">
          <img
            src="/images/face.png"
            alt={name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
        <div>
          <div className="text-lg font-semibold text-graphite">{name}</div>
          <div className="text-graphite-light">{ownerRole}, {brandName}</div>
        </div>
      </div>
    </div>
  );
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const prefix = `/${locale}`;

  const services = [
    { title: t.about.service1Title, description: t.about.service1Desc, icon: <HomeIcon className="w-6 h-6 text-graphite" /> },
    { title: t.about.service2Title, description: t.about.service2Desc, icon: <KeyIcon className="w-6 h-6 text-graphite" /> },
    { title: t.about.service3Title, description: t.about.service3Desc, icon: <DocumentTextIcon className="w-6 h-6 text-graphite" /> },
    { title: t.about.service4Title, description: t.about.service4Desc, icon: <CurrencyDollarIcon className="w-6 h-6 text-graphite" /> },
    { title: t.about.service5Title, description: t.about.service5Desc, icon: <UserGroupIcon className="w-6 h-6 text-graphite" /> },
    { title: t.about.service6Title, description: t.about.service6Desc, icon: <ArrowTrendingUpIcon className="w-6 h-6 text-graphite" /> },
  ];

  const intro1 = t.about.intro1.replace(/{brandName}/g, BRAND_NAME);
  const intro2 = t.about.intro2.replace(/{contactPerson}/g, CONTACT_PERSON);
  const intro3 = t.about.intro3;

  const renderIntro1 = () => {
    const full = intro1;
    if (full.startsWith(BRAND_NAME))
      return (<><strong className="text-graphite">{BRAND_NAME}</strong>{full.slice(BRAND_NAME.length)}</>);
    return full;
  };

  return (
    <>
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <AnimateOnScroll direction="down" className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-cadetblue mb-3 tracking-wide [text-shadow:0_1px_2px_rgba(0,151,178,0.25)]">
              {t.about.title}
            </h1>
            <p className="text-graphite-light max-w-xl mx-auto">
              {t.about.subtitle}
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll direction="up" className="relative rounded-2xl overflow-hidden bg-gray-100 h-80 lg:h-96">
              <img
                src="/images/big_picture.jpg"
                alt={t.about.imageAlt}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimateOnScroll>

            <AnimateOnScroll direction="up">
              <h2 className="text-3xl font-bold text-graphite mb-6">{BRAND_NAME}</h2>
              <div className="space-y-4 text-graphite-light">
                <p>{renderIntro1()}</p>
                <p>{intro2}</p>
                <p>{intro3}</p>
              </div>
              <OwnerCard name={CONTACT_PERSON} brandName={BRAND_NAME} ownerRole={t.about.ownerRole} />
            </AnimateOnScroll>
          </div>
        </Container>
      </Section>

      <Section background="light">
        <Container>
          <AnimateOnScroll direction="down" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-graphite mb-4">{t.about.servicesTitle}</h2>
            <p className="text-graphite-light max-w-2xl mx-auto">
              {t.about.servicesSubtitle}
            </p>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <AnimateOnScroll key={service.title} direction="up">
                <FeatureCard
                  iconShape="square"
                  hoverEffect="lift"
                  centered={false}
                  {...service}
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
                {t.about.ctaTitle}
              </h2>
              <p className="text-graphite-light mb-8 max-w-2xl mx-auto">
                {t.about.ctaBody}
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
