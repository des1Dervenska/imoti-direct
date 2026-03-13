import Link from 'next/link';
import { getPropertyBySlug, getAllSlugs } from '@/lib/properties';
import { notFound } from 'next/navigation';
import PropertyGallery from '@/components/property/PropertyGallery';
import {
  BRAND_NAME,
  CONTACT_PERSON,
  CONTACT_PHONE,
  CONTACT_PHONE_LINK,
  CONTACT_EMAIL,
} from '@/lib/constants';
import { Section, Container, Badge, Card, LinkButton } from '@/components/ui';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MapPinIcon,
  ArrowsPointingOutIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CheckIcon,
  MapIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ClipboardIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { FacebookIcon, TwitterIcon } from '@/components/icons';

// Config: Labels
const TYPE_LABELS = { apartment: 'Апартамент', house: 'Къща', land: 'Парцел' };
const CATEGORY_LABELS = { sale: 'Продажба', rent: 'Наем' };

// Helpers: Formatters
const formatPrice = (price, currency, category) => {
  const formatted = new Intl.NumberFormat('bg-BG').format(price);
  const suffix = category === 'rent' ? '/месец' : '';
  return `${formatted} ${currency}${suffix}`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper: Breadcrumb
function Breadcrumb({ category, title }) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link href="/" className="text-gray-500 hover:text-graphite">Начало</Link>
      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
      <Link
        href={category === 'sale' ? '/sales' : '/rent'}
        className="text-gray-500 hover:text-graphite"
      >
        {category === 'sale' ? 'Продажби' : 'Наеми'}
      </Link>
      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
      <span className="text-graphite font-medium truncate max-w-xs">{title}</span>
    </nav>
  );
}

// Helper: Key detail item
function KeyDetailItem({ icon: Icon, value, label }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-graphite/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <Icon className="w-6 h-6 text-graphite" />
      </div>
      <div className="text-xl font-bold text-graphite">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

// Helper: Feature item
function FeatureItem({ feature }) {
  return (
    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg">
      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
      <span className="text-gray-700">{feature}</span>
    </div>
  );
}

// Helper: Contact action button
function ContactActionButton({ href, icon: Icon, children, variant = 'primary' }) {
  const variants = {
    primary: 'bg-cadetblue hover:bg-cadetblue-dark text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    tertiary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  };

  const Component = href.startsWith('/') ? Link : 'a';
  const extraProps = !href.startsWith('/') ? { target: href.startsWith('http') ? '_blank' : undefined } : {};

  return (
    <Component
      href={href}
      className={`flex items-center justify-center w-full px-4 py-3 font-medium rounded-lg transition-colors ${variants[variant]}`}
      {...extraProps}
    >
      <Icon className="w-5 h-5 mr-2" />
      {children}
    </Component>
  );
}

// Helper: Share button
function ShareButton({ icon: Icon, hoverColor = 'hover:bg-graphite' }) {
  return (
    <button className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-graphite-light ${hoverColor} hover:text-white transition-colors`}>
      <Icon className="w-5 h-5" />
    </button>
  );
}

// Helper: Location display
function LocationText({ neighborhood, city }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <MapPinIcon className="w-4 h-4" />
      <span>{neighborhood ? `${neighborhood}, ${city}` : city}</span>
    </div>
  );
}

// Generate static params for all properties
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: `Имотът не е намерен | ${BRAND_NAME}` };
  }

  return {
    title: `${property.title} | ${BRAND_NAME}`,
    description: property.description.substring(0, 160),
  };
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const {
    title, type, category, price, currency, area, rooms, floor,
    totalFloors, yearBuilt, description, features, images,
    address, city, neighborhood, mapUrl, createdAt,
  } = property;

  // Build key details array dynamically
  const keyDetails = [
    { icon: ArrowsPointingOutIcon, value: `${area} м²`, label: 'Площ', show: true },
    { icon: HomeIcon, value: rooms, label: 'Стаи', show: !!rooms },
    { icon: BuildingOfficeIcon, value: `${floor} / ${totalFloors}`, label: 'Етаж', show: !!floor },
    { icon: CalendarIcon, value: yearBuilt, label: 'Година', show: !!yearBuilt },
  ].filter(item => item.show);

  const location = neighborhood ? `${neighborhood}, ${city}` : city;

  return (
    <>
      {/* Breadcrumb */}
      <Section background="light" padding="sm">
        <Container>
          <Breadcrumb category={category} title={title} />
        </Container>
      </Section>

      {/* Main Content */}
      <Section background="white" padding="md">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative">
                <PropertyGallery images={images} title={title} />
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <Badge.Category category={category} size="lg" />
                  <Badge.Type type={type} size="lg" />
                </div>
              </div>

              {/* Title and Price - Mobile */}
              <div className="lg:hidden">
                <LocationText neighborhood={neighborhood} city={city} />
                <h1 className="text-2xl font-bold text-graphite mb-3 mt-2">{title}</h1>
                <div className="text-3xl font-bold text-graphite">
                  {formatPrice(price, currency, category)}
                </div>
              </div>

              {/* Key Details */}
              <Card className="p-6" variant="light">
                <h2 className="text-lg font-semibold text-graphite mb-4">Основни характеристики</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {keyDetails.map((detail) => (
                    <KeyDetailItem key={detail.label} {...detail} />
                  ))}
                </div>
              </Card>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-graphite mb-4">Описание</h2>
                <p className="text-graphite-light leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Features */}
              {features?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-graphite mb-4">Удобства и екстри</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <h2 className="text-xl font-semibold text-graphite mb-4">Местоположение</h2>
                <Card className="p-6" variant="light">
                  <div className="flex items-start space-x-3 mb-4">
                    <MapPinIcon className="w-6 h-6 text-graphite flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-graphite">{address}</p>
                      <p className="text-gray-500">{location}</p>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500">
                      <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Карта на местоположението</p>
                    </div>
                  </div>

                  {mapUrl && (
                    <LinkButton href={mapUrl} variant="primary" target="_blank">
                      <MapIcon className="w-5 h-5 mr-2" />
                      Виж на картата
                    </LinkButton>
                  )}
                </Card>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Card - Desktop */}
                <Card className="hidden lg:block p-6">
                  <LocationText neighborhood={neighborhood} city={city} />
                  <h1 className="text-xl font-bold text-graphite mb-4 mt-2">{title}</h1>
                  <div className="text-3xl font-bold text-graphite mb-4">
                    {formatPrice(price, currency, category)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Публикувано: {formatDate(createdAt)}
                  </div>
                </Card>

                {/* Contact Card */}
                <div className="bg-graphite/5 border border-graphite/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-graphite mb-4">Свържете се с нас</h3>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-14 h-14 bg-graphite/20 rounded-full flex items-center justify-center">
                      <BuildingOfficeIcon className="w-8 h-8 text-graphite" />
                    </div>
                    <div>
                      <p className="font-semibold text-graphite">{CONTACT_PERSON}</p>
                      <p className="text-sm text-gray-500">{BRAND_NAME}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <ContactActionButton href={`tel:${CONTACT_PHONE_LINK}`} icon={PhoneIcon} variant="primary">
                      {CONTACT_PHONE}
                    </ContactActionButton>
                    <ContactActionButton href={`mailto:${CONTACT_EMAIL}?subject=Запитване за: ${title}`} icon={EnvelopeIcon} variant="secondary">
                      Изпрати имейл
                    </ContactActionButton>
                    <ContactActionButton href="/contact" icon={ChatBubbleLeftRightIcon} variant="tertiary">
                      Заяви оглед
                    </ContactActionButton>
                  </div>
                </div>

                {/* Share Card */}
                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-graphite mb-3">Сподели обявата</h3>
                  <div className="flex space-x-3">
                    <ShareButton icon={FacebookIcon} hoverColor="hover:bg-graphite" />
                    <ShareButton icon={TwitterIcon} hoverColor="hover:bg-graphite-light" />
                    <ShareButton icon={ClipboardIcon} hoverColor="hover:bg-gray-700" />
                  </div>
                </Card>

                {/* Safety Tips */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Съвет за сигурност</h4>
                      <p className="text-sm text-yellow-700">
                        Винаги проверявайте документите на имота преди да извършите плащане. Ние можем да ви помогнем с проверката.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Back to listings */}
      <Section background="light" padding="sm" className="border-t">
        <Container>
          <Link
            href={category === 'sale' ? '/sales' : '/rent'}
            className="inline-flex items-center text-graphite hover:text-graphite-dark font-medium"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Обратно към {category === 'sale' ? 'имоти за продажба' : 'имоти под наем'}
          </Link>
        </Container>
      </Section>
    </>
  );
}
