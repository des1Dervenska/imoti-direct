'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { propertyTypes, cities } from '@/data/properties';
import { SearchIcon } from '@/components/icons';

// Styles
const selectStyle = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white';
const labelStyle = 'block text-sm font-medium text-gray-700 mb-2';
const tabBase = 'flex-1 py-3 px-6 rounded-lg font-medium transition-all';
const tabActive = 'bg-blue-600 text-white shadow-md';
const tabInactive = 'text-gray-600 hover:text-gray-900';
const submitBtnStyle = 'w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-2';
const statValue = 'text-4xl font-bold text-white';
const statLabel = 'text-blue-200 mt-1';

// Config
const CATEGORY_TABS = [
  { value: 'sale', label: 'Купува' },
  { value: 'rent', label: 'Наема' },
];

const STATS = [
  { value: '1000+', label: 'Активни обяви' },
  { value: '500+', label: 'Доволни клиенти' },
  { value: '15+', label: 'Години опит' },
  { value: '50+', label: 'Градове в България' },
];

const SEARCH_FIELDS = [
  {
    name: 'propertyType',
    label: 'Тип имот',
    placeholder: 'Всички типове',
    options: propertyTypes,
  },
  {
    name: 'city',
    label: 'Град',
    placeholder: 'Всички градове',
    options: cities,
  },
];

// Background pattern
const PATTERN_URL = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

export default function HeroSection() {
  const router = useRouter();
  const [category, setCategory] = useState('sale');
  const [filters, setFilters] = useState({ propertyType: '', city: '' });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.propertyType) params.set('type', filters.propertyType);
    if (filters.city) params.set('city', filters.city);

    const url = category === 'sale' ? '/sales' : '/rent';
    const queryString = params.toString();
    router.push(queryString ? `${url}?${queryString}` : url);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 min-h-[600px] flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: PATTERN_URL }} />
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
              {CATEGORY_TABS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={`${tabBase} ${category === value ? tabActive : tabInactive}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SEARCH_FIELDS.map(({ name, label, placeholder, options }) => (
                  <div key={name}>
                    <label className={labelStyle}>{label}</label>
                    <select
                      value={filters[name]}
                      onChange={(e) => handleFilterChange(name, e.target.value)}
                      className={selectStyle}
                    >
                      <option value="">{placeholder}</option>
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* Search Button */}
                <div className="flex items-end">
                  <button type="submit" className={submitBtnStyle}>
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
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className={statValue}>{value}</div>
              <div className={statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
