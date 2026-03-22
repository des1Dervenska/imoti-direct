import Link from 'next/link';
import { DEFAULT_PROPERTY_IMAGE, formatPriceEur } from '@/lib/constants';
import { getDisplayText, getLocationLine } from '@/lib/properties';
import { getTranslations } from '@/lib/translations';
import { ArrowsPointingOutIcon, MapPinIcon, BoltIcon, FireIcon } from '@heroicons/react/24/outline';
import { RoomsIcon } from '@/components/icons';
import { Badge, LinkButton } from '@/components/ui';

const cardStyle = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full';
/** Единен размер за всички текстове в тялото на картичката */
const cardText = 'text-sm text-graphite leading-snug';
const cardTextMuted = 'text-sm text-graphite-light leading-snug';
const featureStyle = `flex items-center ${cardText}`;
const featureIconStyle = 'w-4 h-4 mr-1 shrink-0 text-graphite-light';

const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function PropertyCard({
  property,
  showDescription = true,
  locale = 'bg',
  /** false = само град и квартал (без улица/адрес) – за списъци наем/продажба */
  showStreetAddress = true,
}) {
  const {
    slug,
    code,
    type,
    category,
    status,
    price,
    area,
    rooms,
    images,
    gaz,
    tec,
    hidePricePerSqm,
    priceIncludesVat,
  } = property;
  const display = getDisplayText(property, locale);
  const { title, description } = display;

  const t = getTranslations(locale)?.property ?? {};
  const propertyUrl = locale ? `/${locale}/properties/${slug}` : `/properties/${slug}`;
  const typeLabel = t[type] != null ? t[type] : type;
  const addressLine = showStreetAddress && display.address?.trim()
    ? display.address.trim()
    : getLocationLine(display);
  const imageUrl = images?.[0] || DEFAULT_PROPERTY_IMAGE;
  const isUnavailable = status === 'sold' || status === 'rented';
  const unavailableOverlayText = status === 'sold' ? (t.statusSoldOverlay ?? 'ПРОДАДЕНА') : status === 'rented' ? (t.statusRentedOverlay ?? 'ОТДАДЕНА') : null;

  const features = [
    { Icon: ArrowsPointingOutIcon, value: `${area} м²`, show: true },
    { Icon: RoomsIcon, value: rooms ? `${rooms} ${t.roomsUnit ?? 'стаи'}` : '', show: !!rooms },
    { Icon: BoltIcon, value: t.gaz ?? 'Газ', show: !!gaz },
    { Icon: FireIcon, value: t.tec ?? 'ТЕЦ', show: !!tec },
  ];

  return (
    <div className={`${cardStyle} ${isUnavailable ? 'opacity-85' : ''}`}>
      {/* Image */}
      <Link href={propertyUrl} className="block relative h-52 bg-gray-200 overflow-hidden group">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Sold/Rented overlay */}
        {isUnavailable && unavailableOverlayText && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 pointer-events-none"
            aria-hidden
          >
            <span className="text-white text-2xl md:text-3xl tracking-widest uppercase drop-shadow-lg">
              {unavailableOverlayText}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-graphite opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
          <img src="/images/logo.jpg" alt="" className="w-14 h-14 object-contain opacity-95" />
        </div>

        {/* Category badge – тип имот е в текста под снимката */}
        <div className="absolute top-3 left-3 flex gap-2 z-20">
          <Badge.Category category={category} locale={locale} />
        </div>

        {/* Код – черен текст, бял закръглен фон, долен десен ъгъл */}
        {code != null && String(code).trim() !== '' && (
          <div
            className="absolute bottom-3 right-3 z-25 max-w-[min(100%-1.5rem,14rem)] pointer-events-none"
            aria-hidden
          >
            <span className="inline-block w-full truncate rounded-full bg-white px-3 py-1.5 text-center text-xs font-semibold text-black shadow-md ring-1 ring-black/10 sm:text-sm">
              {(t.listingCode ?? 'КОД')}: {String(code).trim()}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        <div className="mb-2 space-y-1">
          {(() => {
            const { eurText } = formatPriceEur(price, category);
            const vatLabel = priceIncludesVat ? (t.priceWithVat ?? 'с включено ДДС') : (t.priceWithoutVat ?? 'без включено ДДС');
            const pricePerSqm = area > 0 ? (price ?? 0) / area : null;
            const perSqmText = !hidePricePerSqm && pricePerSqm != null
              ? `${Math.round(pricePerSqm)} EUR/м²${category === 'rent' ? '/мес' : ''}`
              : null;
            return (
              <>
                <span className={`block ${cardText} font-medium`}>{eurText}</span>
                {perSqmText && <span className={`block ${cardTextMuted}`}>{perSqmText}</span>}
                <span className={`block ${cardTextMuted}`}>{vatLabel}</span>
              </>
            );
          })()}
        </div>

        <Link href={propertyUrl}>
          <h3 className={`${cardText} font-medium hover:text-graphite-dark transition-colors line-clamp-2 mb-2`}>
            {title}
          </h3>
        </Link>

        <p className={`${cardText} mb-2`}>{typeLabel}</p>

        <div className={`flex items-start gap-1.5 ${cardText} mb-3`}>
          <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-graphite-light" />
          <span className="line-clamp-3">{addressLine}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
          {features.filter(f => f.show).map(({ Icon, value }, idx) => (
            <div key={`${value}-${idx}`} className={featureStyle}>
              <Icon className={featureIconStyle} />
              <span className="font-normal">{value}</span>
            </div>
          ))}
        </div>

        {showDescription && (
          <p className={`${cardTextMuted} mb-4 grow`}>
            {truncateText(description)}
          </p>
        )}

        <LinkButton
          href={propertyUrl}
          variant="accent"
          size="sm"
          className="mt-auto w-full justify-center"
        >
          {t.viewProperty ?? 'Виж имота'}
        </LinkButton>
      </div>
    </div>
  );
}
