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
    return {
      title: `Имотът не е намерен | ${BRAND_NAME}`,
    };
  }

  return {
    title: `${property.title} | ${BRAND_NAME}`,
    description: property.description.substring(0, 160),
  };
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  // If property not found, show 404
  if (!property) {
    notFound();
  }

  const {
    title,
    type,
    category,
    price,
    currency,
    area,
    rooms,
    floor,
    totalFloors,
    yearBuilt,
    description,
    features,
    images,
    address,
    city,
    neighborhood,
    mapUrl,
    createdAt,
  } = property;

  const typeLabels = {
    apartment: 'Апартамент',
    house: 'Къща',
    land: 'Парцел',
  };

  const categoryLabels = {
    sale: 'Продажба',
    rent: 'Наем',
  };

  const formatPrice = (price, currency, category) => {
    const formatted = new Intl.NumberFormat('bg-BG').format(price);
    const suffix = category === 'rent' ? '/месец' : '';
    return `${formatted} ${currency}${suffix}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-gray-100 py-4">
        <div className="max-w-screen-xl mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-graphite">
              Начало
            </Link>
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
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery Section */}
              <div className="relative">
                <PropertyGallery images={images} title={title} />

                {/* Badges - positioned over the gallery */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full shadow-lg ${
                    category === 'sale'
                      ? 'bg-cadetblue text-white'
                      : 'bg-graphite text-white'
                  }`}>
                    {categoryLabels[category]}
                  </span>
                  <span className="px-4 py-2 text-sm font-medium rounded-full bg-white/90 text-gray-700 shadow-lg">
                    {typeLabels[type]}
                  </span>
                </div>
              </div>

              {/* Title and Price - Mobile */}
              <div className="lg:hidden">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{neighborhood ? `${neighborhood}, ${city}` : city}</span>
                </div>
                <h1 className="text-2xl font-bold text-graphite mb-3">{title}</h1>
                <div className="text-3xl font-bold text-graphite">
                  {formatPrice(price, currency, category)}
                </div>
              </div>

              {/* Key Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-graphite mb-4">Основни характеристики</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Area */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-graphite/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ArrowsPointingOutIcon className="w-6 h-6 text-graphite" />
                    </div>
                    <div className="text-xl font-bold text-graphite">{area} м²</div>
                    <div className="text-sm text-gray-500">Площ</div>
                  </div>

                  {/* Rooms */}
                  {rooms && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-graphite/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <HomeIcon className="w-6 h-6 text-graphite" />
                      </div>
                      <div className="text-xl font-bold text-graphite">{rooms}</div>
                      <div className="text-sm text-gray-500">Стаи</div>
                    </div>
                  )}

                  {/* Floor */}
                  {floor && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-graphite/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <BuildingOfficeIcon className="w-6 h-6 text-graphite" />
                      </div>
                      <div className="text-xl font-bold text-graphite">{floor} / {totalFloors}</div>
                      <div className="text-sm text-gray-500">Етаж</div>
                    </div>
                  )}

                  {/* Year */}
                  {yearBuilt && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-graphite/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CalendarIcon className="w-6 h-6 text-graphite" />
                      </div>
                      <div className="text-xl font-bold text-graphite">{yearBuilt}</div>
                      <div className="text-sm text-gray-500">Година</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-graphite mb-4">Описание</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-graphite-light leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>
              </div>

              {/* Features */}
              {features && features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-graphite mb-4">Удобства и екстри</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg"
                      >
                        <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <h2 className="text-xl font-semibold text-graphite mb-4">Местоположение</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <MapPinIcon className="w-6 h-6 text-graphite flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-graphite">{address}</p>
                      <p className="text-gray-500">{neighborhood ? `${neighborhood}, ` : ''}{city}</p>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500">
                      <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Карта на местоположението</p>
                    </div>
                  </div>

                  {/* Map Button */}
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-graphite hover:bg-graphite-dark text-white font-medium rounded-lg transition-colors"
                    >
                      <MapIcon className="w-5 h-5 mr-2" />
                      Виж на картата
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Card - Desktop */}
                <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{neighborhood ? `${neighborhood}, ${city}` : city}</span>
                  </div>
                  <h1 className="text-xl font-bold text-graphite mb-4">{title}</h1>
                  <div className="text-3xl font-bold text-graphite mb-4">
                    {formatPrice(price, currency, category)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Публикувано: {formatDate(createdAt)}
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-graphite/5 border border-graphite/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-graphite mb-4">
                    Свържете се с нас
                  </h3>

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
                    <a
                      href={`tel:${CONTACT_PHONE_LINK}`}
                      className="flex items-center justify-center w-full px-4 py-3 bg-cadetblue hover:bg-cadetblue-dark text-white font-medium rounded-lg transition-colors"
                    >
                      <PhoneIcon className="w-5 h-5 mr-2" />
                      {CONTACT_PHONE}
                    </a>

                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Запитване за: ${title}`}
                      className="flex items-center justify-center w-full px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors"
                    >
                      <EnvelopeIcon className="w-5 h-5 mr-2" />
                      Изпрати имейл
                    </a>

                    <Link
                      href="/contact"
                      className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                      Заяви оглед
                    </Link>
                  </div>
                </div>

                {/* Share Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-graphite mb-3">
                    Сподели обявата
                  </h3>
                  <div className="flex space-x-3">
                    <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-graphite-light hover:bg-graphite hover:text-white transition-colors">
                      <FacebookIcon className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-graphite-light hover:bg-graphite-light hover:text-white transition-colors">
                      <TwitterIcon className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-graphite-light hover:bg-gray-700 hover:text-white transition-colors">
                      <ClipboardIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

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
        </div>
      </section>

      {/* Back to listings */}
      <section className="py-8 bg-gray-50 border-t">
        <div className="max-w-screen-xl mx-auto px-4">
          <Link
            href={category === 'sale' ? '/sales' : '/rent'}
            className="inline-flex items-center text-graphite hover:text-graphite-dark font-medium"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Обратно към {category === 'sale' ? 'имоти за продажба' : 'имоти под наем'}
          </Link>
        </div>
      </section>
    </>
  );
}
