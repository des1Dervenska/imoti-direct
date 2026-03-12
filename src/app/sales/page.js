import PropertyFilters from "@/components/property/PropertyFilters";
import { getSaleProperties } from "@/lib/properties";
import { BRAND_NAME } from "@/lib/constants";

export const metadata = {
  title: `Имоти за продажба | ${BRAND_NAME}`,
  description: "Разгледайте нашите актуални оферти за продажба на апартаменти, къщи и парцели в България.",
};

export default async function SalesPage() {
  const properties = await getSaleProperties();

  return (
    <>
      {/* Page Header - Clean & Elegant */}
      <section className="pt-8 pb-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#495464] mb-3">
              Имоти за продажба
            </h1>
            <p className="text-[#6b7a8f] max-w-xl mx-auto">
              Открийте вашия мечтан дом сред нашите {properties.length} актуални оферти
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Grid */}
      <PropertyFilters
        properties={properties}
        emptyMessage="Няма намерени имоти за продажба"
      />

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-[#495464] mb-4">
              Не намирате подходящ имот?
            </h2>
            <p className="text-[#6b7a8f] mb-6 max-w-xl mx-auto">
              Свържете се с нас и ние ще ви помогнем да намерите точно това, което търсите. Имаме достъп до ексклузивни оферти, които не са публикувани онлайн.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-[cadetblue] hover:bg-[#4a8a8c] text-white font-medium rounded-lg transition-colors"
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
