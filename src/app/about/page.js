import Link from "next/link";
import {
  BRAND_NAME,
  BRAND_DESCRIPTION,
  BRAND_TAGLINE,
  CONTACT_PERSON,
} from '@/lib/constants';

export const metadata = {
  title: `За нас | ${BRAND_NAME}`,
  description: `${BRAND_NAME} е ${BRAND_DESCRIPTION.toLowerCase()}. ${BRAND_TAGLINE}.`,
};

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-20">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              За нас
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Вашият надежден партньор в света на недвижимите имоти
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image placeholder */}
            <div className="bg-gray-200 rounded-2xl h-80 lg:h-96 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <p>Снимка на офиса</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {BRAND_NAME}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong className="text-gray-900">{BRAND_NAME}</strong> е {BRAND_DESCRIPTION.toLowerCase()}. {BRAND_TAGLINE}. Доверете ни се и оставете грижите на нас!
                </p>
                <p>
                  Зад агенцията стои <strong className="text-gray-900">{CONTACT_PERSON}</strong> - професионалист с богат опит в сферата на недвижимите имоти. Предлагаме пълно съдействие при покупка, продажба и отдаване под наем на имоти.
                </p>
                <p>
                  Работим с индивидуален подход към всеки клиент, като се стремим да разберем вашите нужди и да намерим най-доброто решение за вас. Нашата цел е всяка сделка да премине гладко и безпроблемно.
                </p>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{CONTACT_PERSON}</div>
                    <div className="text-blue-600">Управител, {BRAND_NAME}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Нашите услуги</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Предлагаме пълен спектър от услуги в сферата на недвижимите имоти
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Покупко-продажба</h3>
              <p className="text-gray-600 text-sm">
                Пълно съдействие при покупка или продажба на недвижим имот - от първоначалната консултация до финализиране на сделката.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Отдаване под наем</h3>
              <p className="text-gray-600 text-sm">
                Намираме надеждни наематели за вашия имот и се грижим за целия процес - от огледите до подписване на договор.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Проверка на документи</h3>
              <p className="text-gray-600 text-sm">
                Извършваме пълна проверка на документите на имота - собственост, тежести, данъчни задължения и други.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Оценка на имоти</h3>
              <p className="text-gray-600 text-sm">
                Професионална оценка на пазарната стойност на вашия имот, базирана на актуални данни от пазара.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Консултации</h3>
              <p className="text-gray-600 text-sm">
                Безплатни консултации за всички аспекти на сделките с недвижими имоти - правни, финансови и практически.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Инвестиции</h3>
              <p className="text-gray-600 text-sm">
                Консултации за инвестиции в недвижими имоти - анализ на доходност, потенциал за растеж и рискове.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готови да започнем?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Свържете се с нас за безплатна консултация. Ще се радваме да ви помогнем да намерите вашия перфектен имот.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Свържете се с нас
            </Link>
            <Link
              href="/sales"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Разгледайте имотите
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
