import Link from 'next/link';
import { HomeIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function PropertyNotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <HomeIcon className="w-12 h-12 text-gray-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Имотът не е намерен
        </h1>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          За съжаление, имотът който търсите не съществува или вече не е наличен.
          Моля, разгледайте другите ни оферти.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sales"
            className="inline-flex items-center justify-center px-6 py-3 bg-graphite hover:bg-graphite-dark text-white font-medium rounded-lg transition-colors"
          >
            Имоти за продажба
          </Link>
          <Link
            href="/rent"
            className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors"
          >
            Имоти под наем
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-graphite hover:text-graphite-dark"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Към началната страница
          </Link>
        </div>
      </div>
    </section>
  );
}
