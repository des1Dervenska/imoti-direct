import Link from 'next/link';
import { DEFAULT_PROPERTY_IMAGE } from '@/lib/constants';
import { ExpandIcon, RoomsIcon, MapPinIcon } from '@/components/icons';

// Repeated styles
const cardStyle = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full';
const badgeBase = 'px-3 py-1.5 text-xs rounded-full shadow-sm';
const typeBadgeStyle = `${badgeBase} font-medium bg-white/90 text-gray-700`;
const featureStyle = 'flex items-center';
const featureIconStyle = 'w-4 h-4 mr-1';
const buttonStyle = 'mt-auto block w-full text-center py-3 px-4 bg-[cadetblue] hover:bg-[#4a8a8c] text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-[cadetblue]/30';

// Labels config
const TYPE_LABELS = {
  apartment: 'Апартамент',
  house: 'Къща',
  land: 'Парцел',
};

const CATEGORY_LABELS = {
  sale: 'Продажба',
  rent: 'Наем',
};

const CATEGORY_STYLES = {
  sale: 'bg-[cadetblue] text-white',
  rent: 'bg-[#495464] text-white',
};

// Helpers
const formatPrice = (price, currency, category) => {
  const formatted = new Intl.NumberFormat('bg-BG').format(price);
  const suffix = category === 'rent' ? '/месец' : '';
  return `${formatted} ${currency}${suffix}`;
};

const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

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
    images,
  } = property;

  const propertyUrl = `/properties/${slug}`;
  const imageUrl = images?.[0] || DEFAULT_PROPERTY_IMAGE;
  const location = neighborhood ? `${neighborhood}, ${city}` : city;

  // Features config (dynamic based on property data)
  const features = [
    { Icon: ExpandIcon, value: `${area} м²`, show: true },
    { Icon: RoomsIcon, value: `${rooms} стаи`, show: !!rooms },
  ];

  return (
    <div className={cardStyle}>
      {/* Image */}
      <Link href={propertyUrl} className="block relative h-52 bg-gray-200 overflow-hidden group">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#495464] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`${badgeBase} font-semibold ${CATEGORY_STYLES[category]}`}>
            {CATEGORY_LABELS[category]}
          </span>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <span className={typeBadgeStyle}>
            {TYPE_LABELS[type]}
          </span>
        </div>

        {/* Features overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center gap-3 text-white text-sm">
            {features.filter(f => f.show).map(({ Icon, value }) => (
              <div key={value} className={featureStyle}>
                <Icon className={featureIconStyle} />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-2xl font-bold text-[#495464] mb-2">
          {formatPrice(price, currency, category)}
        </div>

        <Link href={propertyUrl}>
          <h3 className="text-lg font-semibold text-[#495464] hover:text-[#3d4654] transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
        </Link>

        <div className="flex items-center text-[#6b7a8f] text-sm mb-3">
          <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0 text-[#6b7a8f]" />
          <span className="font-medium">{location}</span>
        </div>

        <p className="text-[#6b7a8f] text-sm leading-relaxed mb-4 flex-grow">
          {truncateText(description)}
        </p>

        <Link href={propertyUrl} className={buttonStyle}>
          Виж имота
        </Link>
      </div>
    </div>
  );
}
