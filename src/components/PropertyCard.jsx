import Link from 'next/link';

export default function PropertyCard({ property }) {
  const {
    slug,
    title,
    type,
    category,
    price,
    currency,
    area,
    rooms,
    city,
    neighborhood,
    description,
    images
  } = property;

  const typeLabels = {
    apartment: 'Апартамент',
    house: 'Къща',
    land: 'Парцел'
  };

  const categoryLabels = {
    sale: 'Продажба',
    rent: 'Наем'
  };

  const formatPrice = (price, currency, category) => {
    const formatted = new Intl.NumberFormat('bg-BG').format(price);
    const suffix = category === 'rent' ? '/месец' : '';
    return `${formatted} ${currency}${suffix}`;
  };

  // Съкращаване на описанието до 100 символа
  const shortDescription = description && description.length > 100
    ? description.substring(0, 100) + '...'
    : description;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Снимка */}
      <Link href={`/properties/${slug}`} className="block relative h-52 bg-gray-200 overflow-hidden group">
        {/* Реална снимка или placeholder */}
        {images && images.length > 0 && images[0] ? (
          <img
            src={images[0]}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-20 h-20 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 22V12h6v10"/>
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {/* Бадж категория (Продажба/Наем) */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
            category === 'sale'
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {categoryLabels[category]}
          </span>
        </div>

        {/* Бадж тип имот */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/90 text-gray-700 shadow-sm">
            {typeLabels[type]}
          </span>
        </div>

        {/* Характеристики върху снимката */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center gap-3 text-white text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
              <span>{area} м²</span>
            </div>
            {rooms && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span>{rooms} стаи</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Съдържание */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Цена */}
        <div className="text-2xl font-bold text-blue-600 mb-2">
          {formatPrice(price, currency, category)}
        </div>

        {/* Заглавие */}
        <Link href={`/properties/${slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
        </Link>

        {/* Град / Район */}
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <svg className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span className="font-medium">{neighborhood ? `${neighborhood}, ${city}` : city}</span>
        </div>

        {/* Кратко описание */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
          {shortDescription}
        </p>

        {/* Бутон "Виж имота" */}
        <Link
          href={`/properties/${slug}`}
          className="mt-auto block w-full text-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-blue-300"
        >
          Виж имота
        </Link>
      </div>
    </div>
  );
}
