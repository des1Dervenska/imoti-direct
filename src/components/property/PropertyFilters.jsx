'use client';

import { useState, useMemo } from 'react';
import PropertyGrid from './PropertyGrid';
import { propertyTypes, cities } from '@/data/properties';

// Styles
const selectStyle = 'px-4 py-2.5 border border-gray-200 rounded-lg text-graphite bg-white focus:ring-2 focus:ring-graphite/20 focus:border-graphite cursor-pointer transition-colors hover:border-graphite/50';
const countStyle = 'text-graphite-light';
const countNumber = 'font-semibold text-graphite';

// Default price ranges for sale
const SALE_PRICE_RANGES = [
  { value: '', label: 'Всички цени' },
  { value: '0-50000', label: 'До 50 000 EUR', min: 0, max: 50000 },
  { value: '50000-100000', label: '50 000 - 100 000 EUR', min: 50000, max: 100000 },
  { value: '100000-200000', label: '100 000 - 200 000 EUR', min: 100000, max: 200000 },
  { value: '200000+', label: 'Над 200 000 EUR', min: 200000, max: Infinity },
];

// Rent price ranges
const RENT_PRICE_RANGES = [
  { value: '', label: 'Всички цени' },
  { value: '0-500', label: 'До 500 EUR/месец', min: 0, max: 500 },
  { value: '500-1000', label: '500 - 1000 EUR/месец', min: 500, max: 1000 },
  { value: '1000-2000', label: '1000 - 2000 EUR/месец', min: 1000, max: 2000 },
  { value: '2000+', label: 'Над 2000 EUR/месец', min: 2000, max: Infinity },
];

export default function PropertyFilters({
  properties,
  emptyMessage = 'Няма намерени имоти',
  category = 'sale' // 'sale' or 'rent'
}) {
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    priceRange: '',
  });

  const priceRanges = category === 'rent' ? RENT_PRICE_RANGES : SALE_PRICE_RANGES;

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Type filter
      if (filters.type && property.type !== filters.type) return false;

      // City filter
      if (filters.city && property.city !== filters.city) return false;

      // Price filter
      if (filters.priceRange) {
        const range = priceRanges.find(r => r.value === filters.priceRange);
        if (range && (property.price < range.min || property.price > range.max)) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters, priceRanges]);

  return (
    <>
      {/* Filters Section */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Type Filter */}
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className={selectStyle}
              >
                <option value="">Всички типове</option>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={filters.city}
                onChange={(e) => updateFilter('city', e.target.value)}
                className={selectStyle}
              >
                <option value="">Всички градове</option>
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>

              {/* Price Range */}
              <select
                value={filters.priceRange}
                onChange={(e) => updateFilter('priceRange', e.target.value)}
                className={selectStyle}
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <div className={countStyle}>
              <span className={countNumber}>{filteredProperties.length}</span> намерени имота
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <PropertyGrid
            properties={filteredProperties}
            emptyMessage={emptyMessage}
          />
        </div>
      </section>
    </>
  );
}
