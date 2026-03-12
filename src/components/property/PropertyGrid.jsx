import PropertyCard from './PropertyCard';
import { BoxIcon } from '@/components/icons';

export default function PropertyGrid({ properties, emptyMessage = "Няма намерени имоти" }) {
  // Ако няма имоти, показваме съобщение
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <BoxIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">Опитайте да промените критериите за търсене</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
