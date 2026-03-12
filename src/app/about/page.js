import {
  BRAND_NAME,
  BRAND_DESCRIPTION,
  BRAND_TAGLINE,
  CONTACT_PERSON,
} from '@/lib/constants';
import { Section, Container, Card, LinkButton, FeatureCard } from '@/components/ui';
import {
  HomeIcon,
  KeyIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

export const metadata = {
  title: `За нас | ${BRAND_NAME}`,
  description: `${BRAND_NAME} е ${BRAND_DESCRIPTION.toLowerCase()}. ${BRAND_TAGLINE}.`,
};

// Config: Services
const SERVICES = [
  {
    title: 'Покупко-продажба',
    description: 'Пълно съдействие при покупка или продажба на недвижим имот - от първоначалната консултация до финализиране на сделката.',
    icon: <HomeIcon className="w-6 h-6 text-graphite" />,
  },
  {
    title: 'Отдаване под наем',
    description: 'Намираме надеждни наематели за вашия имот и се грижим за целия процес - от огледите до подписване на договор.',
    icon: <KeyIcon className="w-6 h-6 text-graphite" />,
  },
  {
    title: 'Проверка на документи',
    description: 'Извършваме пълна проверка на документите на имота - собственост, тежести, данъчни задължения и други.',
    icon: <DocumentTextIcon className="w-6 h-6 text-graphite" />,
  },
  {
    title: 'Оценка на имоти',
    description: 'Професионална оценка на пазарната стойност на вашия имот, базирана на актуални данни от пазара.',
    icon: <CurrencyDollarIcon className="w-6 h-6 text-graphite" />,
  },
  {
    title: 'Консултации',
    description: 'Безплатни консултации за всички аспекти на сделките с недвижими имоти - правни, финансови и практически.',
    icon: <UserGroupIcon className="w-6 h-6 text-graphite" />,
  },
  {
    title: 'Инвестиции',
    description: 'Консултации за инвестиции в недвижими имоти - анализ на доходност, потенциал за растеж и рискове.',
    icon: <ArrowTrendingUpIcon className="w-6 h-6 text-graphite" />,
  },
];

// Helper: Owner card
function OwnerCard({ name, brandName }) {
  return (
    <div className="mt-8 p-6 bg-graphite/5 rounded-xl">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-graphite/10 rounded-full flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-graphite" />
        </div>
        <div>
          <div className="text-lg font-semibold text-graphite">{name}</div>
          <div className="text-graphite-light">Управител, {brandName}</div>
        </div>
      </div>
    </div>
  );
}

// Helper: Image placeholder
function ImagePlaceholder({ text }) {
  return (
    <div className="bg-gray-200 rounded-2xl h-80 lg:h-96 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <BuildingOfficeIcon className="w-24 h-24 mx-auto mb-4" />
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-graphite mb-3">За нас</h1>
            <p className="text-graphite-light max-w-xl mx-auto">
              Вашият надежден партньор в света на недвижимите имоти
            </p>
          </div>
        </Container>
      </Section>

      {/* About Section */}
      <Section background="white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ImagePlaceholder text="Снимка на офиса" />

            <div>
              <h2 className="text-3xl font-bold text-graphite mb-6">{BRAND_NAME}</h2>
              <div className="space-y-4 text-graphite-light">
                <p>
                  <strong className="text-graphite">{BRAND_NAME}</strong> е {BRAND_DESCRIPTION.toLowerCase()}. {BRAND_TAGLINE}. Доверете ни се и оставете грижите на нас!
                </p>
                <p>
                  Зад агенцията стои <strong className="text-graphite">{CONTACT_PERSON}</strong> - професионалист с богат опит в сферата на недвижимите имоти. Предлагаме пълно съдействие при покупка, продажба и отдаване под наем на имоти.
                </p>
                <p>
                  Работим с индивидуален подход към всеки клиент, като се стремим да разберем вашите нужди и да намерим най-доброто решение за вас. Нашата цел е всяка сделка да премине гладко и безпроблемно.
                </p>
              </div>

              <OwnerCard name={CONTACT_PERSON} brandName={BRAND_NAME} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Services Section */}
      <Section background="light">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-graphite mb-4">Нашите услуги</h2>
            <p className="text-graphite-light max-w-2xl mx-auto">
              Предлагаме пълен спектър от услуги в сферата на недвижимите имоти
            </p>
          </div>

          <FeatureCard.Grid columns={3}>
            {SERVICES.map((service) => (
              <FeatureCard
                key={service.title}
                iconShape="square"
                hoverEffect="lift"
                centered={false}
                {...service}
              />
            ))}
          </FeatureCard.Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="light">
        <Container>
          <Card variant="outlined" className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-graphite mb-4">
              Готови да започнем?
            </h2>
            <p className="text-graphite-light mb-8 max-w-2xl mx-auto">
              Свържете се с нас за безплатна консултация. Ще се радваме да ви помогнем да намерите вашия перфектен имот.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LinkButton href="/contact" variant="accent">
                Свържете се с нас
              </LinkButton>
              <LinkButton href="/sales" variant="accent-outline">
                Разгледайте имотите
              </LinkButton>
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
