import PropertyGrid from "@/components/PropertyGrid";
import { getSaleProperties, propertyTypes, cities } from "@/data/properties";

export const metadata = {
  title: "Имоти за продажба | Имоти Директ",
  description: "Разгледайте нашите актуални оферти за продажба на апартаменти, къщи и парцели в цяла България.",
};

export default function SalesPage() {
  const properties = getSaleProperties();

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Имоти за продажба
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Открийте вашия мечтан дом сред нашите {properties.length} актуални оферти за продажба
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Type Filter */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Всички типове</option>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {/* City Filter */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Всички градове</option>
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>

              {/* Price Range */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Всички цени</option>
                <option value="0-50000">До 50 000 EUR</option>
                <option value="50000-100000">50 000 - 100 000 EUR</option>
                <option value="100000-200000">100 000 - 200 000 EUR</option>
                <option value="200000+">Над 200 000 EUR</option>
              </select>
            </div>

            {/* Results count */}
            <div className="text-gray-600">
              <span className="font-semibold text-gray-900">{properties.length}</span> намерени имота
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <PropertyGrid
            properties={properties}
            emptyMessage="Няма намерени имоти за продажба"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Не намирате подходящ имот?
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Свържете се с нас и ние ще ви помогнем да намерите точно това, което търсите. Имаме достъп до ексклузивни оферти, които не са публикувани онлайн.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Свържете се с нас
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
