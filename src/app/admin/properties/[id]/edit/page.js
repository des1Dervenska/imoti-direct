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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Редактирай: {property.title}
        </h1>
        <a
          href={`/admin/properties/${property.id}/print`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2h-2m-4-1V8a2 2 0 012-2h2a2 2 0 012 2v1m-4 12h6" />
          </svg>
          Печат / PDF за клиент
        </a>
      </div>
      <PropertyForm property={property} isDemo={isDemo} />
    </div>
  );
}
