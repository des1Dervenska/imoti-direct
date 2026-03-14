import Link from 'next/link';
import AdminPropertiesToolbar from '@/components/admin/AdminPropertiesToolbar';
import { getAllPropertiesAdmin } from '@/lib/properties';

export const metadata = {
  title: 'Имоти | Admin',
};

export default async function AdminPropertiesPage() {
  const { data: properties, error, isDemo } = await getAllPropertiesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Имоти</h1>
        {!isDemo && (
          <Link
            href="/admin/properties/new"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Добави имот
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Грешка: {error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <AdminPropertiesToolbar properties={properties} isDemo={isDemo} />
      </div>
    </div>
  );
}
