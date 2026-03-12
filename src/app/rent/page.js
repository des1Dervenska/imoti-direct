import PropertyFilters from "@/components/property/PropertyFilters";
import { getRentProperties } from "@/lib/properties";
import { BRAND_NAME } from "@/lib/constants";
import { Section, Container, LinkButton, Card } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";

export const metadata = {
  title: `Имоти под наем | ${BRAND_NAME}`,
  description: "Разгледайте нашите актуални оферти за наем на апартаменти и къщи в България.",
};

// Config: Info cards
const INFO_CARDS = [
  {
    title: "Проверени наемодатели",
    description: "Всички наемодатели са проверени и верифицирани от нашия екип",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Сигурни договори",
    description: "Помагаме с изготвянето на договори, които защитават вашите интереси",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    title: "Поддръжка 24/7",
    description: "Винаги сме на разположение за въпроси и съдействие",
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
  },
];

// Reusable: Info card component
function InfoCard({ title, description, icon }) {
  return (
    <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
      <div className="w-14 h-14 bg-graphite/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-graphite mb-2">{title}</h3>
      <p className="text-graphite-light text-sm">{description}</p>
    </div>
  );
}

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
          <div className="grid md:grid-cols-3 gap-8">
            {INFO_CARDS.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
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
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </LinkButton>
          </Card>
        </Container>
      </Section>
    </>
  );
}
