import HeroSection from "@/components/HeroSection";
import PropertyGrid from "@/components/PropertyGrid";
import { getSaleProperties, getRentProperties } from "@/lib/properties";
import Link from "next/link";

export default async function Home() {
  const allSaleProperties = await getSaleProperties();
  const allRentProperties = await getRentProperties();
  const saleProperties = allSaleProperties.slice(0, 3);
  const rentProperties = allRentProperties.slice(0, 3);

  return (
    <>
      <HeroSection />

      {/* Featured Sale Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Имоти за продажба</h2>
              <p className="text-gray-600 mt-2">Разгледайте нашите най-нови оферти</p>
            </div>
            <Link
              href="/sales"
              className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Виж всички
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <PropertyGrid properties={saleProperties} />

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/sales"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Виж всички оферти за продажба
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Rent Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Имоти под наем</h2>
              <p className="text-gray-600 mt-2">Намерете перфектния имот за вас</p>
            </div>
            <Link
              href="/rent"
              className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Виж всички
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <PropertyGrid properties={rentProperties} />

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/rent"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Виж всички оферти под наем
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Защо да изберете нас?</h2>
            <p className="text-gray-600 mt-2">Нашите предимства</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Сигурност</h3>
              <p className="text-gray-600 text-sm">Пълна проверка на всички документи и юридическа подкрепа</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Бързина</h3>
              <p className="text-gray-600 text-sm">Бърза и ефективна комуникация с всички страни по сделката</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Професионализъм</h3>
              <p className="text-gray-600 text-sm">Екип от опитни брокери с дългогодишен опит в сектора</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Честни цени</h3>
              <p className="text-gray-600 text-sm">Прозрачност в цените и без скрити такси</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готови ли сте да намерите своя нов дом?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Свържете се с нас за безплатна консултация и ние ще ви помогнем да намерите перфектния имот според вашите нужди и бюджет.
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
