import PropertyForm from '@/components/admin/PropertyForm';
import { getPropertyById } from '@/lib/properties';
import Link from 'next/link';

export const metadata = {
  title: 'Редактирай имот | Admin',
};

export default async function EditPropertyPage({ params }) {
  const { id } = await params;
  const { data: property, error, isDemo } = await getPropertyById(id);

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Грешка</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          href="/admin/properties"
          className="text-blue-600 hover:text-blue-700"
        >
          ← Обратно към имотите
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Имотът не е намерен</h1>
        <p className="text-gray-600 mb-6">Имот с ID {id} не съществува.</p>
        <Link
          href="/admin/properties"
          className="text-blue-600 hover:text-blue-700"
        >
          ← Обратно към имотите
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Редактирай: {property.title}
      </h1>
      <PropertyForm property={property} isDemo={isDemo} />
    </div>
  );
}
