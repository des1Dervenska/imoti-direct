import Link from 'next/link';
import { getPropertyBySlug, getDisplayText, getLocationLine } from '@/lib/properties';
import { notFound } from 'next/navigation';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyShareBar from '@/components/property/PropertyShareBar';
import YouTubeVideoThumbnail from '@/components/property/YouTubeVideoThumbnail';
import {
  BRAND_NAME,
  CONTACT_PERSON,
  CONTACT_PERSON_EN,
  CONTACT_PHONE,
  CONTACT_PHONE_LINK,
  CONTACT_EMAIL,
  formatPriceEur,
} from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import { Section, Container, Card, LinkButton, AnimateOnScroll } from '@/components/ui';
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
  BoltIcon,
  FireIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

/** Винаги свежи данни – нови обяви се отварят веднага. */
export const dynamic = 'force-dynamic';

function formatDate(dateString, locale) {
  return new Date(dateString).toLocaleDateString(locale === 'en' ? 'en-GB' : 'bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getYoutubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
      return u.searchParams.get('v') || null;
    }
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null;
    if (u.hostname === 'www.youtu.be') return u.pathname.slice(1).split('/')[0] || null;
  } catch (_) {}
  return null;
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
      <span className="text-graphite truncate max-w-xs">{title}</span>
    </nav>
  );
}

function KeyDetailItem({ icon: Icon, value, label }) {
  return (
    <div className="text-center group">
      <div className="w-14 h-14 bg-cadetblue/15 rounded-lg flex items-center justify-center mx-auto mb-2 transition-colors duration-300 group-hover:bg-cadetblue/25">
        <Icon className="w-6 h-6 text-graphite" />
      </div>
      <div className="text-xl text-graphite" style={{ fontWeight: 400 }}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function FeatureItem({ feature }) {
  return (
    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg">
      <CheckIcon className="w-5 h-5 text-green-500 shrink-0" />
      <span className="text-base text-black">{feature}</span>
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
      className={`flex items-center justify-center w-full px-4 py-3 rounded-lg transition-colors ${variants[variant]}`}
      {...extraProps}
    >
      <Icon className="w-5 h-5 mr-2" />
      {children}
    </Component>
  );
}

function LocationText({ locationLine, className = '' }) {
  return (
    <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`.trim()} style={{ fontWeight: 400 }}>
      <MapPinIcon className="w-4 h-4 shrink-0" />
      <span>{locationLine}</span>
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
  const display = getDisplayText(property, locale);
  return {
    title: `${display.title} | ${BRAND_NAME}`,
    description: (display.description || '').substring(0, 160),
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

  const display = getDisplayText(property, locale);
  const { title, description, features, priceNote } = display;
  const titleHasDigits = /\d/.test(String(title ?? ''));
  const {
    type, category, status, price, area, rooms, floor,
    totalFloors, yearBuilt, yearBuiltStatus, images, mapUrl, videoUrl, createdAt,
    gaz, tec, hidePricePerSqm, priceIncludesVat, constructionType, code,
  } = property;

  const isUnavailable = status === 'sold' || status === 'rented';
  const unavailableOverlayText = status === 'sold' ? t.statusSoldOverlay : status === 'rented' ? t.statusRentedOverlay : null;

  const pricePerSqm = !hidePricePerSqm && area > 0 ? Math.round((price ?? 0) / area) : null;
  const yearBuiltLabelKey = yearBuiltStatus ? `yearBuiltStatus_${yearBuiltStatus}` : null;
  const yearBuiltValue = yearBuiltLabelKey
    ? (yearBuiltStatus === 'not_in_use'
      ? t[yearBuiltLabelKey]
      : `${t[yearBuiltLabelKey]}${yearBuilt ? `, ${yearBuilt}` : ''}`)
    : yearBuilt;
  const noVal = t.noValue ?? 'няма';
  const keyDetails = [
    { icon: ArrowsPointingOutIcon, value: area != null && area !== '' ? `${area} м²` : noVal, label: t.area },
    ...(!hidePricePerSqm ? [{
      icon: CurrencyDollarIcon,
      value: pricePerSqm != null ? `${pricePerSqm} EUR/m²${category === 'rent' ? t.pricePerSqmRentSuffix : ''}` : noVal,
      label: t.pricePerSqm,
    }] : []),
    { icon: HomeIcon, value: rooms != null && rooms !== '' ? String(rooms) : noVal, label: t.rooms },
    {
      icon: BuildingOfficeIcon,
      value: floor !== undefined && floor !== null && floor !== ''
        ? (totalFloors != null ? `${floor === 0 ? t.floorParter : floor} / ${totalFloors}` : (floor === 0 ? t.floorParter : String(floor)))
        : '',
      label: t.floor,
    },
    { icon: BoltIcon, value: gaz ? t.yes : noVal, label: t.gaz },
    { icon: FireIcon, value: tec ? t.yes : noVal, label: t.tec },
    { icon: CalendarIcon, value: yearBuiltStatus || yearBuilt ? yearBuiltValue : noVal, label: yearBuiltStatus ? t.yearBuilt : t.year },
    { icon: BuildingOfficeIcon, value: constructionType ? (t[`constructionType_${constructionType}`] ?? constructionType) : noVal, label: t.constructionType },
  ];

  const locationLine = getLocationLine(display);
  // Не включваме display.address (улица/адрес) за да не излиза на клиента.
  const mapQuery = locationLine || [display.city, display.neighborhood].filter(Boolean).join(', ');
  const contactSubject = locale === 'en' ? 'Inquiry re:' : 'Запитване за:';
  const propertyPath = `${prefix}/properties/${slug}`;

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
                  <PropertyGallery
                    images={images}
                    title={title}
                    isUnavailable={isUnavailable}
                    unavailableOverlayText={unavailableOverlayText}
                    code={code != null ? String(code).trim() : ''}
                    codeLabel={t.listingCode ?? 'КОД'}
                  />
                </div>

                <div className="lg:hidden" style={{ fontWeight: 400 }}>
                  <LocationText locationLine={locationLine} />
                  <h1
                    className={`${titleHasDigits ? 'brand-name-sans ' : ''}text-2xl text-cadetblue mb-3 mt-2 tracking-wide [text-shadow:0_1px_2px_rgba(0,151,178,0.25)]`}
                  >
                    {title}
                  </h1>
                  <div className="text-graphite">
                    <span className="text-3xl">{formatPriceEur(price, category).eurText}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{priceIncludesVat ? t.priceWithVat : t.priceWithoutVat}</span>
                  </div>
                </div>

                {priceNote && (
                  <p className="text-graphite-light text-sm md:text-base leading-relaxed">
                    {priceNote}
                  </p>
                )}
                <Card className="p-6" variant="light">
                  <h2 className="text-lg text-graphite mb-4">{t.keyDetails}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                    {keyDetails.map((detail) => (
                      <KeyDetailItem key={detail.label} {...detail} />
                    ))}
                  </div>
                </Card>

                <div className="lg:hidden mt-4">
                  <PropertyShareBar propertyPath={propertyPath} title={title} locale={locale} />
                </div>

                {videoUrl && getYoutubeVideoId(videoUrl) && (
                  <YouTubeVideoThumbnail
                    videoId={getYoutubeVideoId(videoUrl)}
                    videoUrl={videoUrl}
                    watchVideoLabel={t.watchVideo}
                  />
                )}

                <div>
                  <h2 className="text-xl text-graphite mb-4">{t.description}</h2>
                  <p className="text-lg text-black leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>

                {features?.length > 0 && (
                  <div>
                    <h2 className="text-xl text-graphite mb-4">{t.features}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {features.map((feature, index) => (
                        <FeatureItem key={index} feature={feature} />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl text-graphite mb-4">{t.location}</h2>
                  <Card className="p-6" variant="light">
                    <div className="flex items-start space-x-3 mb-4">
                      <MapPinIcon className="w-6 h-6 text-graphite flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-graphite">{locationLine}</p>
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
                  <Card className="hidden lg:block p-6 font-sans" style={{ fontWeight: 400 }}>
                    <LocationText locationLine={locationLine} className="text-lg text-gray-600" />
                    <h1
                      className={`${titleHasDigits ? 'brand-name-sans ' : ''}text-xl text-cadetblue mt-3 mb-3 font-normal`}
                    >
                      {title}
                    </h1>
                    <div className="mb-4">
                      <span className="text-xl text-graphite">{formatPriceEur(price, category).eurText}</span>
                      <span className="block text-xs text-gray-500 mt-0.5">{priceIncludesVat ? t.priceWithVat : t.priceWithoutVat}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {t.published}: {formatDate(createdAt, locale)}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <PropertyShareBar propertyPath={propertyPath} title={title} locale={locale} />
                    </div>
                  </Card>

                  <div className="bg-graphite/5 border border-graphite/10 rounded-2xl p-6 group">
                    <h3 className="text-lg text-graphite mb-4">{t.contactUs}</h3>

                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 bg-cadetblue/15 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-cadetblue/25">
                        <BuildingOfficeIcon className="w-6 h-6 text-graphite" />
                      </div>
                      <div>
                        <p className="text-graphite">{locale === 'en' ? CONTACT_PERSON_EN : CONTACT_PERSON}</p>
                        <p className="text-sm text-gray-500">{BRAND_NAME}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <ContactActionButton href={`tel:${CONTACT_PHONE_LINK}`} icon={PhoneIcon} variant="primary">
                        {CONTACT_PHONE}
                      </ContactActionButton>
                      <ContactActionButton
                        href={`${prefix}/contact?subject=consultation&propertyPath=${encodeURIComponent(propertyPath)}`}
                        icon={EnvelopeIcon}
                        variant="secondary"
                      >
                        {t.sendEmail}
                      </ContactActionButton>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                      <div>
                        <h4 className="text-yellow-800 mb-1">{t.safetyTip}</h4>
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
              className="inline-flex items-center text-graphite hover:text-graphite-dark"
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
