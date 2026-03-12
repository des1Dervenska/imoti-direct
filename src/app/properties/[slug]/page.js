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
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
            <Link
              href={category === 'sale' ? '/sales' : '/rent'}
              className="text-gray-500 hover:text-graphite"
            >
              {category === 'sale' ? 'Продажби' : 'Наеми'}
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
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
                      <svg className="w-6 h-6 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                      </svg>
                    </div>
                    <div className="text-xl font-bold text-graphite">{area} м²</div>
                    <div className="text-sm text-gray-500">Площ</div>
                  </div>

                  {/* Rooms */}
                  {rooms && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-graphite/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                      </div>
                      <div className="text-xl font-bold text-graphite">{rooms}</div>
                      <div className="text-sm text-gray-500">Стаи</div>
                    </div>
                  )}

                  {/* Floor */}
                  {floor && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-graphite/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      </div>
                      <div className="text-xl font-bold text-graphite">{floor} / {totalFloors}</div>
                      <div className="text-sm text-gray-500">Етаж</div>
                    </div>
                  )}

                  {/* Year */}
                  {yearBuilt && (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-graphite/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
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
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
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
                    <svg className="w-6 h-6 text-graphite flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <div>
                      <p className="font-medium text-graphite">{address}</p>
                      <p className="text-gray-500">{neighborhood ? `${neighborhood}, ` : ''}{city}</p>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                      </svg>
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
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                      </svg>
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
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
                      <svg className="w-8 h-8 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
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
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      {CONTACT_PHONE}
                    </a>

                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Запитване за: ${title}`}
                      className="flex items-center justify-center w-full px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      Изпрати имейл
                    </a>

                    <Link
                      href="/contact"
                      className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
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
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                      </svg>
                    </button>
                    <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-graphite-light hover:bg-graphite-light hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </button>
                    <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-graphite-light hover:bg-green-500 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </button>
                    <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-graphite-light hover:bg-gray-700 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Safety Tips */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
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
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Обратно към {category === 'sale' ? 'имоти за продажба' : 'имоти под наем'}
          </Link>
        </div>
      </section>
    </>
  );
}
