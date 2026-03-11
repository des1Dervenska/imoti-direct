import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h1>
      <p className="text-gray-600 mb-8">Изберете секция за управление</p>

      <Link
        href="/admin/properties"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Управление на имоти
      </Link>
    </div>
  );
}
