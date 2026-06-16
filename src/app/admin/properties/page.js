import Link from 'next/link';
import AdminPropertiesToolbar from '@/components/admin/AdminPropertiesToolbar';
import { getAllPropertiesAdmin } from '@/lib/properties';

export const metadata = {
  title: 'Имоти | Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage() {
  const { data: properties, error, isDemo } = await getAllPropertiesAdmin();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Имоти</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">
            Преглед, филтриране и управление на всички обяви в системата.
          </p>
        </div>
        {!isDemo && (
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center justify-center rounded-xl bg-cadetblue px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-cadetblue/25 transition hover:bg-cadetblue-dark hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cadetblue/40"
          >
            + Добави имот
          </Link>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800 shadow-sm">
          <p className="font-medium">Грешка: {error}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-md ring-1 ring-black/[0.04]">
        <AdminPropertiesToolbar properties={properties} isDemo={isDemo} />
      </div>
    </div>
  );
}
