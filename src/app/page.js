import HeroSection from "@/components/sections/HeroSection";
import PropertyGrid from "@/components/property/PropertyGrid";
import { getSaleProperties, getRentProperties } from "@/lib/properties";
import Link from "next/link";
import { Section, Container, LinkButton, Card } from "@/components/ui";

// Config: "Why Choose Us" features
const FEATURES = [
  {
    title: "Сигурност",
    description: "Пълна проверка на всички документи и юридическа подкрепа",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Бързина",
    description: "Бърза и ефективна комуникация с всички страни по сделката",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Професионализъм",
    description: "Екип от опитни брокери с дългогодишен опит в сектора",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    title: "Честни цени",
    description: "Прозрачност в цените и без скрити такси",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

// Reusable: Section header with "See all" link
function SectionHeader({ title, subtitle, href, linkText = "Виж всички" }) {
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
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}

// Reusable: Mobile "See all" link
function MobileLink({ href, children }) {
  return (
    <div className="mt-8 text-center sm:hidden">
      <Link
        href={href}
        className="inline-flex items-center text-graphite hover:text-graphite-dark font-medium"
      >
        {children}
        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

// Reusable: Feature card for "Why Choose Us"
function FeatureCard({ title, description, icon }) {
  return (
    <div className="text-center p-6">
      <div className="w-16 h-16 bg-graphite/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-graphite mb-2">{title}</h3>
      <p className="text-graphite-light text-sm">{description}</p>
    </div>
  );
}

export default async function Home() {
  const allSaleProperties = await getSaleProperties();
  const allRentProperties = await getRentProperties();
  const saleProperties = allSaleProperties.slice(0, 3);
  const rentProperties = allRentProperties.slice(0, 3);

  return (
    <>
      <HeroSection />

      {/* Featured Sale Properties */}
      <Section background="white">
        <Container>
          <SectionHeader
            title="Имоти за продажба"
            subtitle="Разгледайте нашите най-нови оферти"
            href="/sales"
          />
          <PropertyGrid properties={saleProperties} />
          <MobileLink href="/sales">Виж всички оферти за продажба</MobileLink>
        </Container>
      </Section>

      {/* Featured Rent Properties */}
      <Section background="light">
        <Container>
          <SectionHeader
            title="Имоти под наем"
            subtitle="Намерете перфектния имот за вас"
            href="/rent"
          />
          <PropertyGrid properties={rentProperties} />
          <MobileLink href="/rent">Виж всички оферти под наем</MobileLink>
        </Container>
      </Section>

      {/* Why Choose Us */}
      <Section background="white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-graphite">Защо да изберете нас?</h2>
            <p className="text-graphite-light mt-2">Нашите предимства</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="light">
        <Container>
          <Card variant="outlined" className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-graphite mb-4">
              Готови ли сте да намерите своя нов дом?
            </h2>
            <p className="text-graphite-light mb-8 max-w-2xl mx-auto">
              Свържете се с нас за безплатна консултация и ние ще ви помогнем да
              намерите перфектния имот според вашите нужди и бюджет.
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
