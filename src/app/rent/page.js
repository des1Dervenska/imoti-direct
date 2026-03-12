import PropertyFilters from "@/components/property/PropertyFilters";
import { getRentProperties } from "@/lib/properties";
import { BRAND_NAME } from "@/lib/constants";
import { Section, Container, LinkButton, Card, FeatureCard } from "@/components/ui";
import {
  CheckCircleIcon,
  LockClosedIcon,
  LifebuoyIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: `Имоти под наем | ${BRAND_NAME}`,
  description: "Разгледайте нашите актуални оферти за наем на апартаменти и къщи в България.",
};

// Config: Info cards
const INFO_CARDS = [
  {
    title: "Проверени наемодатели",
    description: "Всички наемодатели са проверени и верифицирани от нашия екип",
    icon: <CheckCircleIcon className="w-7 h-7 text-graphite" />,
  },
  {
    title: "Сигурни договори",
    description: "Помагаме с изготвянето на договори, които защитават вашите интереси",
    icon: <LockClosedIcon className="w-7 h-7 text-graphite" />,
  },
  {
    title: "Поддръжка 24/7",
    description: "Винаги сме на разположение за въпроси и съдействие",
    icon: <LifebuoyIcon className="w-7 h-7 text-graphite" />,
  },
];

export default async function RentPage() {
  const properties = await getRentProperties();

  return (
    <>
      {/* Page Header */}
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-graphite mb-3">
              Имоти под наем
            </h1>
            <p className="text-graphite-light max-w-xl mx-auto">
              Намерете перфектния имот за вас сред нашите {properties.length} актуални оферти
            </p>
          </div>
        </Container>
      </Section>

      {/* Filters & Grid */}
      <PropertyFilters
        properties={properties}
        category="rent"
        emptyMessage="Няма намерени имоти под наем"
      />

      {/* Info Section */}
      <Section background="white" padding="md">
        <Container>
          <FeatureCard.Grid columns={3}>
            {INFO_CARDS.map((card) => (
              <FeatureCard
                key={card.title}
                background="light"
                hoverEffect="lift"
                {...card}
              />
            ))}
          </FeatureCard.Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="light" padding="md">
        <Container>
          <Card variant="outlined" className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-graphite mb-4">
              Имате имот за отдаване под наем?
            </h2>
            <p className="text-graphite-light mb-6 max-w-xl mx-auto">
              Доверете се на нашия опит. Ще намерим надежден наемател за вашия имот бързо и безопасно.
            </p>
            <LinkButton href="/contact" variant="accent">
              Свържете се с нас
              <ArrowRightIcon className="w-5 h-5" />
            </LinkButton>
          </Card>
        </Container>
      </Section>
    </>
  );
}
