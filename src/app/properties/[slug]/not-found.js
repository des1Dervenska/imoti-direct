import Link from 'next/link';

export default function PropertyNotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
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
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Към началната страница
          </Link>
        </div>
      </div>
    </section>
  );
}
