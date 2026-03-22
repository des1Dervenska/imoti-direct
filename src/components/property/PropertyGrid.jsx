import PropertyCard from './PropertyCard';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import { getTranslations } from '@/lib/translations';
import { InboxIcon } from '@heroicons/react/24/outline';

const gridStyle = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
const emptyContainer = 'text-center py-16';
const emptyIconWrapper = 'inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4';
const emptyIconStyle = 'w-10 h-10 text-gray-400';
const emptyTitle = 'text-xl text-graphite mb-2';
const emptyText = 'text-graphite-light';

function EmptyState({ message, tryChangeCriteria }) {
  return (
    <div className={emptyContainer}>
      <div className={emptyIconWrapper}>
        <InboxIcon className={emptyIconStyle} />
      </div>
      <h3 className={emptyTitle}>{message}</h3>
      {tryChangeCriteria && <p className={emptyText}>{tryChangeCriteria}</p>}
    </div>
  );
}

export default function PropertyGrid({
  properties,
  emptyMessage = 'Няма намерени имоти',
  animateCards = false,
  showDescription = true,
  locale = 'bg',
  showStreetAddress = true,
}) {
  const t = getTranslations(locale)?.filters;
  const tryChangeCriteria = t?.tryChangeCriteria;

  if (!properties?.length) {
    return <EmptyState message={emptyMessage} tryChangeCriteria={tryChangeCriteria} />;
  }

  return (
    <div className={gridStyle}>
      {properties.map((property) =>
        animateCards ? (
          <AnimateOnScroll key={property.id} direction="up">
            <PropertyCard
              property={property}
              showDescription={showDescription}
              locale={locale}
              showStreetAddress={showStreetAddress}
            />
          </AnimateOnScroll>
        ) : (
          <PropertyCard
            key={property.id}
            property={property}
            showDescription={showDescription}
            locale={locale}
            showStreetAddress={showStreetAddress}
          />
        )
      )}
    </div>
  );
}
