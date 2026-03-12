import PropertyFilters from "@/components/property/PropertyFilters";
import { getRentProperties } from "@/lib/properties";
import { BRAND_NAME } from "@/lib/constants";

export const metadata = {
  title: `Имоти под наем | ${BRAND_NAME}`,
  description: "Разгледайте нашите актуални оферти за наем на апартаменти и къщи в България.",
};

export default async function RentPage() {
  const properties = await getRentProperties();

  return (
    <>
      {/* Page Header - Clean & Elegant */}
      <section className="pt-8 pb-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#495464] mb-3">
              Имоти под наем
            </h1>
            <p className="text-[#6b7a8f] max-w-xl mx-auto">
              Намерете перфектния имот за вас сред нашите {properties.length} актуални оферти
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Grid */}
      <PropertyFilters
        properties={properties}
        category="rent"
        emptyMessage="Няма намерени имоти под наем"
      />

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-14 h-14 bg-[#495464]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#495464]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#495464] mb-2">Проверени наемодатели</h3>
              <p className="text-[#6b7a8f] text-sm">Всички наемодатели са проверени и верифицирани от нашия екип</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-14 h-14 bg-[#495464]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#495464]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#495464] mb-2">Сигурни договори</h3>
              <p className="text-[#6b7a8f] text-sm">Помагаме с изготвянето на договори, които защитават вашите интереси</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-14 h-14 bg-[#495464]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#495464]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#495464] mb-2">Поддръжка 24/7</h3>
              <p className="text-[#6b7a8f] text-sm">Винаги сме на разположение за въпроси и съдействие</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-[#495464] mb-4">
              Имате имот за отдаване под наем?
            </h2>
            <p className="text-[#6b7a8f] mb-6 max-w-xl mx-auto">
              Доверете се на нашия опит. Ще намерим надежден наемател за вашия имот бързо и безопасно.
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
