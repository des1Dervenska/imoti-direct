import Link from 'next/link';

export const metadata = {
  title: 'Admin | ArtHouse94',
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Admin Panel
              </Link>
              <nav className="flex gap-4">
                <Link
                  href="/admin/properties"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Имоти
                </Link>
              </nav>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Към сайта
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-screen-xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
