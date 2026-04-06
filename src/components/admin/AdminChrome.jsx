'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminLogout from '@/components/admin/AdminLogout';

/** Страницата за печат има собена лента — без втори admin header. */
function isPropertyPrintPath(pathname) {
  return /^\/admin\/properties\/[^/]+\/print\/?$/.test(pathname ?? '');
}

export default function AdminChrome({ children }) {
  const pathname = usePathname();
  const hideChrome = isPropertyPrintPath(pathname);

  return (
    <>
      {!hideChrome && (
        <header className="print:hidden sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-md">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                <Link
                  href="/admin/properties"
                  className="text-lg font-semibold tracking-tight text-gray-900 hover:text-cadetblue-dark transition-colors"
                >
                  Admin
                </Link>
                <nav className="flex gap-1">
                  <Link
                    href="/admin/properties"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-slate-100 hover:text-gray-900 transition-colors"
                  >
                    Имоти
                  </Link>
                  <Link
                    href="/admin/posters"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-slate-100 hover:text-gray-900 transition-colors"
                  >
                    Постери
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-cadetblue-dark transition-colors"
                >
                  ← Към сайта
                </Link>
                <AdminLogout />
              </div>
            </div>
          </div>
        </header>
      )}

      <main
        className={
          hideChrome
            ? 'max-w-[1600px] mx-auto'
            : 'max-w-[1600px] mx-auto px-4 sm:px-6 py-8 pb-12'
        }
      >
        {children}
      </main>
    </>
  );
}
