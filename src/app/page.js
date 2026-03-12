import HeroSection from "@/components/sections/HeroSection";
import PropertyGrid from "@/components/property/PropertyGrid";
import { getSaleProperties, getRentProperties } from "@/lib/properties";
import Link from "next/link";
import { Section, Container, LinkButton, Card, FeatureCard } from "@/components/ui";
import {
  ShieldCheckIcon,
  BoltIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Config: "Why Choose Us" features
const FEATURES = [
  {
    title: "Сигурност",
    description: "Пълна проверка на всички документи и юридическа подкрепа",
    icon: <ShieldCheckIcon className="w-8 h-8 text-graphite" />,
  },
  {
    title: "Бързина",
    description: "Бърза и ефективна комуникация с всички страни по сделката",
    icon: <BoltIcon className="w-8 h-8 text-graphite" />,
  },
  {
    title: "Професионализъм",
    description: "Екип от опитни брокери с дългогодишен опит в сектора",
    icon: <UserGroupIcon className="w-8 h-8 text-graphite" />,
  },
  {
    title: "Честни цени",
    description: "Прозрачност в цените и без скрити такси",
    icon: <CurrencyDollarIcon className="w-8 h-8 text-graphite" />,
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
          <ChevronRightIcon className="w-5 h-5 ml-1" />
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
        <ChevronRightIcon className="w-5 h-5 ml-1" />
      </Link>
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

          <FeatureCard.Grid columns={4}>
            {FEATURES.map((feature) => (
              <FeatureCard
                key={feature.title}
                background="transparent"
                hoverEffect="none"
                {...feature}
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
