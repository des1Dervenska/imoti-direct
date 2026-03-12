import Link from 'next/link';
import { DEFAULT_PROPERTY_IMAGE } from '@/lib/constants';
import { ExpandIcon, RoomsIcon, MapPinIcon } from '@/components/icons';

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
        {/* Реална снимка или default placeholder */}
        <img
          src={images && images.length > 0 && images[0] ? images[0] : DEFAULT_PROPERTY_IMAGE}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

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
              <ExpandIcon className="w-4 h-4 mr-1" />
              <span>{area} м²</span>
            </div>
            {rooms && (
              <div className="flex items-center">
                <RoomsIcon className="w-4 h-4 mr-1" />
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
          <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" />
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
