import PropertyFilters from "@/components/property/PropertyFilters";
import { getSaleProperties } from "@/lib/properties";
import { BRAND_NAME } from "@/lib/constants";
import { Section, Container, LinkButton, Card, AnimateOnScroll } from "@/components/ui";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: `Имоти за продажба | ${BRAND_NAME}`,
  description: "Разгледайте нашите актуални оферти за продажба на апартаменти, къщи и парцели в България.",
};

export default async function SalesPage() {
  const properties = await getSaleProperties();

  return (
    <>
      {/* Page Header */}
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <AnimateOnScroll direction="down" className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-cadetblue mb-3 tracking-wide [text-shadow:0_1px_2px_rgba(95,158,160,0.25)]">
              Имоти за продажба
            </h1>
            <p className="text-graphite-light max-w-xl mx-auto">
              Открийте вашия мечтан дом сред нашите {properties.length} актуални оферти
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Filters & Grid – без AnimateOnScroll, за да работи sticky тулбарът при скрол */}
      <PropertyFilters
        properties={properties}
        emptyMessage="Няма намерени имоти за продажба"
        animateCards
      />

      {/* CTA Section */}
      <Section background="white" padding="md">
        <Container>
          <AnimateOnScroll direction="up">
            <Card variant="outlined" className="bg-gray-50 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-graphite mb-4">
              Не намирате подходящ имот?
            </h2>
            <p className="text-graphite-light mb-6 max-w-xl mx-auto">
              Свържете се с нас и ние ще ви помогнем да намерите точно това, което търсите.
              Имаме достъп до ексклузивни оферти, които не са публикувани онлайн.
            </p>
            <LinkButton href="/contact" variant="accent">
              Свържете се с нас
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </LinkButton>
          </Card>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  );
}
