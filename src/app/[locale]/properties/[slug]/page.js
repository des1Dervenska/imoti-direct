import Link from 'next/link';
import { getPropertyBySlug } from '@/lib/properties';
import { notFound } from 'next/navigation';
import PropertyGallery from '@/components/property/PropertyGallery';
import {
  BRAND_NAME,
  CONTACT_PERSON,
  CONTACT_PHONE,
  CONTACT_PHONE_LINK,
  CONTACT_EMAIL,
  formatPriceEurAndBgn,
} from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import { Section, Container, Badge, Card, LinkButton, AnimateOnScroll } from '@/components/ui';
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
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

function formatDate(dateString, locale) {
  return new Date(dateString).toLocaleDateString(locale === 'en' ? 'en-GB' : 'bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function Breadcrumb({ category, title, locale }) {
  const t = getTranslations(locale).property;
  const prefix = `/${locale}`;
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link href={prefix} className="text-gray-500 hover:text-graphite">{t.home}</Link>
      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
      <Link
        href={category === 'sale' ? `${prefix}/sales` : `${prefix}/rent`}
        className="text-gray-500 hover:text-graphite"
      >
        {category === 'sale' ? t.sales : t.rent}
      </Link>
      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
      <span className="text-graphite font-medium truncate max-w-xs">{title}</span>
    </nav>
  );
}

function KeyDetailItem({ icon: Icon, value, label }) {
  return (
    <div className="text-center group">
      <div className="w-14 h-14 bg-cadetblue/15 rounded-lg flex items-center justify-center mx-auto mb-2 transition-colors duration-300 group-hover:bg-cadetblue/25">
        <Icon className="w-6 h-6 text-graphite" />
      </div>
      <div className="text-xl font-bold text-graphite">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function FeatureItem({ feature }) {
  return (
    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg">
      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
      <span className="text-gray-700">{feature}</span>
    </div>
  );
}

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

function LocationText({ neighborhood, city }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <MapPinIcon className="w-4 h-4" />
      <span>{neighborhood ? `${neighborhood}, ${city}` : city}</span>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const t = getTranslations(locale).property;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return { title: `${t.notFound} | ${BRAND_NAME}` };
  }
  return {
    title: `${property.title} | ${BRAND_NAME}`,
    description: property.description?.substring(0, 160),
  };
}

export default async function PropertyDetailPage({ params }) {
  const { locale, slug } = await params;
  const t = getTranslations(locale).property;
  const prefix = `/${locale}`;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const {
    title, type, category, price, area, rooms, floor,
    totalFloors, yearBuilt, description, features, images,
    address, city, neighborhood, mapUrl, createdAt,
  } = property;

  const keyDetails = [
    { icon: ArrowsPointingOutIcon, value: `${area} м²`, label: t.area, show: true },
    { icon: HomeIcon, value: rooms, label: t.rooms, show: !!rooms },
    { icon: BuildingOfficeIcon, value: `${floor} / ${totalFloors}`, label: t.floor, show: !!floor },
    { icon: CalendarIcon, value: yearBuilt, label: t.year, show: !!yearBuilt },
  ].filter((item) => item.show);

  const location = neighborhood ? `${neighborhood}, ${city}` : city;
  const mapQuery = [address, neighborhood, city].filter(Boolean).join(', ');
  const contactSubject = locale === 'en' ? 'Inquiry re:' : 'Запитване за:';
  const propertyPath = `${prefix}/${category === 'sale' ? 'sales' : 'rent'}`;

  return (
    <>
      <Section background="light" padding="sm">
        <Container>
          <AnimateOnScroll direction="down">
            <Breadcrumb category={category} title={title} locale={locale} />
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section background="white" padding="md">
        <Container>
          <AnimateOnScroll direction="up">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="relative">
                  <PropertyGallery images={images} title={title} />
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <Badge.Category category={category} size="lg" locale={locale} />
                    <Badge.Type type={type} size="lg" locale={locale} />
                  </div>
                </div>

                <div className="lg:hidden">
                  <LocationText neighborhood={neighborhood} city={city} />
                  <h1 className="text-2xl font-bold text-cadetblue mb-3 mt-2 tracking-wide [text-shadow:0_1px_2px_rgba(0,151,178,0.25)]">{title}</h1>
                  <div className="text-graphite">
                    <span className="text-3xl font-bold">{formatPriceEurAndBgn(price, category).eurText}</span>
                    <span className="block text-sm text-gray-500 mt-0.5">{formatPriceEurAndBgn(price, category).bgnText}</span>
                  </div>
                </div>

                <Card className="p-6" variant="light">
                  <h2 className="text-lg font-semibold text-graphite mb-4">{t.keyDetails}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {keyDetails.map((detail) => (
                      <KeyDetailItem key={detail.label} {...detail} />
                    ))}
                  </div>
                </Card>

                <div>
                  <h2 className="text-xl font-semibold text-graphite mb-4">{t.description}</h2>
                  <p className="text-graphite-light leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>

                {features?.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-graphite mb-4">{t.features}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {features.map((feature, index) => (
                        <FeatureItem key={index} feature={feature} />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold text-graphite mb-4">{t.location}</h2>
                  <Card className="p-6" variant="light">
                    <div className="flex items-start space-x-3 mb-4">
                      <MapPinIcon className="w-6 h-6 text-graphite flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-graphite">{address}</p>
                        <p className="text-gray-500">{location}</p>
                      </div>
                    </div>

                    {mapQuery ? (
                      <div className="rounded-lg overflow-hidden h-48 md:h-64 bg-gray-200 mb-4">
                        <iframe
                          src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={t.mapAria}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
                        <div className="text-center text-gray-500">
                          <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>{t.mapTitle}</p>
                        </div>
                      </div>
                    )}

                    {(mapUrl || mapQuery) && (
                      <LinkButton
                        href={mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                        variant="primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapIcon className="w-5 h-5 mr-2" />
                        {t.viewOnMap}
                      </LinkButton>
                    )}
                  </Card>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <Card className="hidden lg:block p-6">
                    <LocationText neighborhood={neighborhood} city={city} />
                    <h1 className="text-xl font-bold text-cadetblue mb-4 mt-2 tracking-wide [text-shadow:0_1px_2px_rgba(0,151,178,0.25)]">{title}</h1>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-graphite">{formatPriceEurAndBgn(price, category).eurText}</span>
                      <span className="block text-sm text-gray-500 mt-0.5">{formatPriceEurAndBgn(price, category).bgnText}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {t.published}: {formatDate(createdAt, locale)}
                    </div>
                  </Card>

                  <div className="bg-graphite/5 border border-graphite/10 rounded-2xl p-6 group">
                    <h3 className="text-lg font-semibold text-graphite mb-4">{t.contactUs}</h3>

                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 bg-cadetblue/15 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-cadetblue/25">
                        <BuildingOfficeIcon className="w-6 h-6 text-graphite" />
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
                      <ContactActionButton href={`mailto:${CONTACT_EMAIL}?subject=${contactSubject} ${title}`} icon={EnvelopeIcon} variant="secondary">
                        {t.sendEmail}
                      </ContactActionButton>
                      <ContactActionButton
                        href={`${prefix}/contact?subject=consultation&propertyPath=${encodeURIComponent(propertyPath)}`}
                        icon={ChatBubbleLeftRightIcon}
                        variant="tertiary"
                      >
                        {t.requestViewing}
                      </ContactActionButton>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-1">{t.safetyTip}</h4>
                        <p className="text-sm text-yellow-700">
                          {t.safetyTipBody}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      <Section background="light" padding="sm" className="border-t">
        <Container>
          <AnimateOnScroll direction="up">
            <Link
              href={category === 'sale' ? `${prefix}/sales` : `${prefix}/rent`}
              className="inline-flex items-center text-graphite hover:text-graphite-dark font-medium"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              {t.backTo} {category === 'sale' ? getTranslations(locale).sales.title : getTranslations(locale).rent.title}
            </Link>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  );
}
