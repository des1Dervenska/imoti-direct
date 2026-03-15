'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { getTranslations } from '@/lib/translations';

export default function PropertyNotFound() {
  const pathname = usePathname();
  const locale = pathname?.startsWith('/en') ? 'en' : 'bg';
  const t = getTranslations(locale);
  const prefix = `/${locale}`;

  const notFoundMsg =
    locale === 'en'
      ? 'Sorry, the property you are looking for does not exist or is no longer available. Please browse our other listings.'
      : 'За съжаление, имотът който търсите не съществува или вече не е наличен. Моля, разгледайте другите ни оферти.';

  const backHome = locale === 'en' ? 'Back to home' : 'Към началната страница';

  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4 group">
        <div className="w-14 h-14 bg-cadetblue/15 rounded-lg flex items-center justify-center mx-auto mb-6 transition-colors duration-300 group-hover:bg-cadetblue/25">
          <HomeIcon className="w-6 h-6 text-graphite" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t.property.notFound}
        </h1>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {notFoundMsg}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`${prefix}/sales`}
            className="inline-flex items-center justify-center px-6 py-3 bg-graphite hover:bg-graphite-dark text-white font-medium rounded-lg transition-colors"
          >
            {t.sales?.title ?? (locale === 'en' ? 'Properties for sale' : 'Имоти за продажба')}
          </Link>
          <Link
            href={`${prefix}/rent`}
            className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors"
          >
            {t.rent?.title ?? (locale === 'en' ? 'Properties for rent' : 'Имоти под наем')}
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href={prefix}
            className="inline-flex items-center text-graphite hover:text-graphite-dark"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            {backHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
