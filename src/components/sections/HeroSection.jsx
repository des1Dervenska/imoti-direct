'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { propertyTypes, cities } from '@/data/properties';
import { SearchIcon } from '@/components/icons';

export default function HeroSection() {
  const router = useRouter();
  const [category, setCategory] = useState('sale');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (propertyType) params.set('type', propertyType);
    if (city) params.set('city', city);

    const url = category === 'sale' ? '/sales' : '/rent';
    const queryString = params.toString();
    router.push(queryString ? `${url}?${queryString}` : url);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 min-h-[600px] flex items-center">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 py-20 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Намерете мечтания си имот
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Над 1000 актуални обяви за продажба и наем на апартаменти, къщи и парцели в цяла България
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            {/* Category Tabs */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setCategory('sale')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  category === 'sale'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Купува
              </button>
              <button
                type="button"
                onClick={() => setCategory('rent')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  category === 'rent'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Наема
              </button>
            </div>

            {/* Search Fields */}
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип имот
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value="">Всички типове</option>
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Град
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value="">Всички градове</option>
                    {cities.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-2"
                  >
                    <SearchIcon className="w-5 h-5" />
                    <span>Търси</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-white">1000+</div>
            <div className="text-blue-200 mt-1">Активни обяви</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white">500+</div>
            <div className="text-blue-200 mt-1">Доволни клиенти</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white">15+</div>
            <div className="text-blue-200 mt-1">Години опит</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white">50+</div>
            <div className="text-blue-200 mt-1">Градове в България</div>
          </div>
        </div>
      </div>
    </section>
  );
}
