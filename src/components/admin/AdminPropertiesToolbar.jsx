'use client';

import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PropertyTable from './PropertyTable';
import {
  propertyTypes,
  propertyStatuses,
} from '@/data/properties';

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'По дата (най-нови)' },
  { value: 'date-asc', label: 'По дата (най-стари)' },
  { value: 'code-asc', label: 'По код (А-Я / 0-9)' },
  { value: 'code-desc', label: 'По код (Я-А / 9-0)' },
  { value: 'title-asc', label: 'По име (А-Я)' },
  { value: 'title-desc', label: 'По име (Я-А)' },
  { value: 'price-asc', label: 'По цена (възходящо)' },
  { value: 'price-desc', label: 'По цена (низходящо)' },
  { value: 'city-asc', label: 'По град (А-Я)' },
];

const inputClass =
  'block w-full rounded-xl border border-gray-200/90 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 hover:border-gray-300 focus:border-cadetblue focus:outline-none focus:ring-2 focus:ring-cadetblue/20';
const selectClass =
  'w-full rounded-xl border border-gray-200/90 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition hover:border-gray-300 focus:border-cadetblue focus:outline-none focus:ring-2 focus:ring-cadetblue/20';
const categoryTabs = [
  { value: '', label: 'Всички' },
  { value: 'sale', label: 'Продажби' },
  { value: 'rent', label: 'Наем' },
];

export default function AdminPropertiesToolbar({ properties = [], isDemo = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('');

  const uniqueCities = useMemo(() => {
    const cities = [...new Set(properties.map((p) => p.city).filter(Boolean))];
    return cities.sort((a, b) => a.localeCompare(b));
  }, [properties]);

  const uniqueNeighborhoods = useMemo(() => {
    const set = new Set();
    properties.forEach((p) => {
      if (p.neighborhood) set.add(p.neighborhood);
      if (p.neighborhoodEn) set.add(p.neighborhoodEn);
    });
    return [...set].sort((a, b) => a.localeCompare(b, 'bg'));
  }, [properties]);

  const filteredAndSorted = useMemo(() => {
    let list = [...(properties || [])];

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.slug && p.slug.toLowerCase().includes(q)) ||
          (p.address && p.address.toLowerCase().includes(q)) ||
          (p.code && String(p.code).toLowerCase().includes(q))
      );
    }
    if (categoryFilter) list = list.filter((p) => p.category === categoryFilter);
    if (typeFilter) list = list.filter((p) => p.type === typeFilter);
    if (statusFilter) list = list.filter((p) => p.status === statusFilter);
    if (cityFilter) list = list.filter((p) => p.city === cityFilter);
    const nb = neighborhoodFilter.trim().toLowerCase();
    if (nb) {
      list = list.filter((p) => {
        const bg = (p.neighborhood || '').toLowerCase();
        const en = (p.neighborhoodEn || '').toLowerCase();
        return bg.includes(nb) || en.includes(nb);
      });
    }

    switch (sortBy) {
      case 'date-desc':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'date-asc':
        list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'code-asc':
        list.sort((a, b) => String(a.code || '').localeCompare(String(b.code || ''), 'bg'));
        break;
      case 'code-desc':
        list.sort((a, b) => String(b.code || '').localeCompare(String(a.code || ''), 'bg'));
        break;
      case 'title-asc':
        list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-desc':
        list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'price-asc':
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'city-asc':
        list.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
        break;
      default:
        break;
    }

    return list;
  }, [properties, searchQuery, sortBy, categoryFilter, typeFilter, statusFilter, cityFilter, neighborhoodFilter]);

  return (
    <div>
      {/* Търсене и филтри */}
      <div className="border-b border-gray-100 bg-gradient-to-br from-white via-slate-50/60 to-cadetblue/[0.06] px-5 py-5 md:px-6 md:py-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="inline-flex rounded-xl border border-gray-200/90 bg-white/90 p-1 shadow-sm">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setCategoryFilter(tab.value)}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    categoryFilter === tab.value
                      ? 'bg-cadetblue text-white shadow-sm'
                      : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Търсене по име */}
            <div className="w-full">
              <label htmlFor="admin-search" className="mb-1 block text-xs font-medium text-gray-600">
                Търсене по име, адрес или код
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cadetblue/50" />
                <input
                  id="admin-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Заглавие, slug, адрес, код…"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 w-full">
            {/* Сортиране */}
            <div className="w-full">
              <label htmlFor="admin-sort" className="mb-1 block text-xs font-medium text-gray-600">
                Сортиране
              </label>
              <select
                id="admin-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={selectClass}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Тип */}
            <div className="w-full">
              <label htmlFor="admin-type" className="mb-1 block text-xs font-medium text-gray-600">
                Тип
              </label>
              <select
                id="admin-type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={selectClass}
              >
                <option value="">Всички</option>
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Статус */}
            <div className="w-full">
              <label htmlFor="admin-status" className="mb-1 block text-xs font-medium text-gray-600">
                Статус
              </label>
              <select
                id="admin-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={selectClass}
              >
                <option value="">Всички</option>
                {propertyStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Град */}
            <div className="w-full">
              <label htmlFor="admin-city" className="mb-1 block text-xs text-gray-600">
                Град
              </label>
              <select
                id="admin-city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className={selectClass}
              >
                <option value="">Всички</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Квартал — последно в реда */}
            <div className="w-full">
              <label htmlFor="admin-neighborhood" className="mb-1 block text-xs font-medium text-gray-600">
                Квартал
              </label>
              <input
                id="admin-neighborhood"
                type="text"
                list="admin-neighborhood-list"
                value={neighborhoodFilter}
                onChange={(e) => setNeighborhoodFilter(e.target.value)}
                placeholder="Всички / напишете или изберете…"
                className={inputClass}
                autoComplete="off"
              />
              <datalist id="admin-neighborhood-list">
                {uniqueNeighborhoods.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </div>
          </div>
        </div>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200/90 bg-white/90 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
          <span className="tabular-nums text-gray-900">{filteredAndSorted.length}</span>
          <span className="text-gray-400">/</span>
          <span className="tabular-nums">{properties.length}</span>
          <span className="text-gray-500">имота</span>
        </p>
      </div>

      <div className="bg-white px-4 py-4 md:px-6 md:pb-6 md:pt-2">
        <PropertyTable properties={filteredAndSorted} isDemo={isDemo} />
      </div>
    </div>
  );
}
