import Link from 'next/link';
import { DEFAULT_PROPERTY_IMAGE, formatPriceEurAndBgn } from '@/lib/constants';
import { ArrowsPointingOutIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { RoomsIcon } from '@/components/icons';
import { Badge, LinkButton } from '@/components/ui';

// Styles
const cardStyle = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full';
const featureStyle = 'flex items-center';
const featureIconStyle = 'w-4 h-4 mr-1';

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
    { Icon: ArrowsPointingOutIcon, value: `${area} м²`, show: true },
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
        <div className="absolute inset-0 bg-graphite opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge.Category category={category} />
        </div>

        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <Badge.Type type={type} />
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
        <div className="mb-2">
          {(() => {
            const { eurText, bgnText } = formatPriceEurAndBgn(price, category);
            return (
              <>
                <span className="text-2xl font-bold text-graphite">{eurText}</span>
                <span className="block text-sm font-normal text-graphite-light">{bgnText}</span>
              </>
            );
          })()}
        </div>

        <Link href={propertyUrl}>
          <h3 className="text-lg font-semibold text-graphite hover:text-graphite-dark transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
        </Link>

        <div className="flex items-center text-graphite-light text-sm mb-3">
          <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0 text-graphite-light" />
          <span className="font-medium">{location}</span>
        </div>

        <p className="text-graphite-light text-sm leading-relaxed mb-4 flex-grow">
          {truncateText(description)}
        </p>

        <LinkButton
          href={propertyUrl}
          variant="accent"
          className="mt-auto w-full justify-center"
        >
          Виж имота
        </LinkButton>
      </div>
    </div>
  );
}
