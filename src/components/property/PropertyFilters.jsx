'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import PropertyGrid from './PropertyGrid';
import { propertyTypes, cities } from '@/data/properties';
import {
  FunnelIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const selectStyle =
  'px-4 py-2.5 border border-gray-200 rounded-lg text-graphite bg-white focus:ring-2 focus:ring-graphite/20 focus:border-graphite cursor-pointer transition-colors hover:border-graphite/50';
const countStyle = 'text-graphite-light';
const countNumber = 'font-semibold text-graphite';

const SALE_PRICE_RANGES = [
  { value: '', label: 'Всички цени' },
  { value: '0-50000', label: 'До 50 000 EUR', min: 0, max: 50000 },
  { value: '50000-100000', label: '50 000 - 100 000 EUR', min: 50000, max: 100000 },
  { value: '100000-200000', label: '100 000 - 200 000 EUR', min: 100000, max: 200000 },
  { value: '200000+', label: 'Над 200 000 EUR', min: 200000, max: Infinity },
];

const RENT_PRICE_RANGES = [
  { value: '', label: 'Всички цени' },
  { value: '0-500', label: 'До 500 EUR/месец', min: 0, max: 500 },
  { value: '500-1000', label: '500 - 1000 EUR/месец', min: 500, max: 1000 },
  { value: '1000-2000', label: '1000 - 2000 EUR/месец', min: 1000, max: 2000 },
  { value: '2000+', label: 'Над 2000 EUR/месец', min: 2000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'По цена (възходящо)' },
  { value: 'price-desc', label: 'По цена (низходящо)' },
  { value: 'area-asc', label: 'По площ (възходящо)' },
  { value: 'area-desc', label: 'По площ (низходящо)' },
  { value: 'date-desc', label: 'По дата (най-нови)' },
  { value: 'date-asc', label: 'По дата (най-стари)' },
  { value: 'title-asc', label: 'По име (А-Я)' },
];

const ROOMS_OPTIONS = [
  { value: '', label: 'Всички стаи' },
  { value: '1', label: '1 стая' },
  { value: '2', label: '2 стаи' },
  { value: '3', label: '3 стаи' },
  { value: '4', label: '4+ стаи' },
];

export default function PropertyFilters({
  properties,
  emptyMessage = 'Няма намерени имоти',
  category = 'sale',
}) {
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    priceRange: '',
    rooms: '',
    minArea: '',
    maxArea: '',
  });
  const [sortBy, setSortBy] = useState('date-desc');
  const [sortOpen, setSortOpen] = useState(false);
  const [extraFiltersOpen, setExtraFiltersOpen] = useState(false);
  const sortRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setExtraFiltersOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const priceRanges = category === 'rent' ? RENT_PRICE_RANGES : SALE_PRICE_RANGES;

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearExtraFilters = () => {
    setFilters((prev) => ({
      ...prev,
      rooms: '',
      minArea: '',
      maxArea: '',
    }));
  };

  const hasExtraFilters = filters.rooms || filters.minArea || filters.maxArea;

  const filteredProperties = useMemo(() => {
    let list = properties.filter((property) => {
      if (filters.type && property.type !== filters.type) return false;
      if (filters.city && property.city !== filters.city) return false;
      if (filters.priceRange) {
        const range = priceRanges.find((r) => r.value === filters.priceRange);
        if (range && (property.price < range.min || property.price > range.max)) return false;
      }
      if (filters.rooms) {
        const r = Number(filters.rooms);
        if (r === 4) {
          if (!property.rooms || property.rooms < 4) return false;
        } else if (property.rooms !== r) return false;
      }
      if (filters.minArea) {
        const min = Number(filters.minArea);
        if (!isNaN(min) && (property.area ?? 0) < min) return false;
      }
      if (filters.maxArea) {
        const max = Number(filters.maxArea);
        if (!isNaN(max) && (property.area ?? 0) > max) return false;
      }
      return true;
    });

    switch (sortBy) {
      case 'price-asc':
        list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'area-asc':
        list = [...list].sort((a, b) => (a.area ?? 0) - (b.area ?? 0));
        break;
      case 'area-desc':
        list = [...list].sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
        break;
      case 'date-desc':
        list = [...list].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case 'date-asc':
        list = [...list].sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
        break;
      case 'title-asc':
        list = [...list].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      default:
        break;
    }

    return list;
  }, [properties, filters, priceRanges, sortBy]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Сортиране';

  return (
    <>
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
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

              {/* Сортиране – икона, при клик се отваря dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${sortOpen ? 'border-graphite bg-gray-50' : 'border-gray-200 hover:border-graphite/50'} text-graphite bg-white focus:ring-2 focus:ring-graphite/20 focus:border-graphite`}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                >
                  <ArrowsUpDownIcon className="w-5 h-5 shrink-0" />
                  <span className="hidden sm:inline text-left max-w-[140px] truncate">
                    {currentSortLabel}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 shrink-0 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>
                {sortOpen && (
                  <ul
                    className="absolute left-0 top-full mt-1 min-w-[200px] py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    role="listbox"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={sortBy === opt.value}
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm ${sortBy === opt.value ? 'bg-graphite/10 text-graphite font-medium' : 'text-graphite hover:bg-gray-50'}`}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Допълнителни филтри – красив dropdown */}
              <div className="relative" ref={filterRef}>
                <button
                  type="button"
                  onClick={() => setExtraFiltersOpen((v) => !v)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${extraFiltersOpen || hasExtraFilters ? 'border-graphite bg-gray-50' : 'border-gray-200 hover:border-graphite/50'} text-graphite bg-white focus:ring-2 focus:ring-graphite/20 focus:border-graphite`}
                  aria-expanded={extraFiltersOpen}
                >
                  <FunnelIcon className="w-5 h-5 shrink-0" />
                  <span className="hidden sm:inline">Филтри</span>
                  {hasExtraFilters && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-medium rounded-full bg-graphite text-white">
                      !
                    </span>
                  )}
                  <ChevronDownIcon className={`w-4 h-4 shrink-0 transition-transform ${extraFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
                {extraFiltersOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden">
                    <div className="p-4 bg-gray-50/80 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-graphite">Допълнителни филтри</h3>
                      <p className="text-xs text-graphite-light mt-0.5">Стаи и площ</p>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Стаи</label>
                        <select
                          value={filters.rooms}
                          onChange={(e) => updateFilter('rooms', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-graphite bg-white focus:ring-2 focus:ring-graphite/20 focus:border-graphite transition-colors"
                        >
                          {ROOMS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Площ от (m²)</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="мин"
                            value={filters.minArea}
                            onChange={(e) => updateFilter('minArea', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-graphite focus:ring-2 focus:ring-graphite/20 focus:border-graphite transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Площ до (m²)</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="макс"
                            value={filters.maxArea}
                            onChange={(e) => updateFilter('maxArea', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-graphite focus:ring-2 focus:ring-graphite/20 focus:border-graphite transition-colors"
                          />
                        </div>
                      </div>
                      {hasExtraFilters && (
                        <button
                          type="button"
                          onClick={() => {
                            clearExtraFilters();
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-graphite-light hover:text-graphite border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Изчисти филтри
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={countStyle}>
              <span className={countNumber}>{filteredProperties.length}</span> намерени имота
            </div>
          </div>
        </div>
      </section>

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
