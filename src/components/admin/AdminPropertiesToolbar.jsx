'use client';

import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PropertyTable from './PropertyTable';
import {
  propertyTypes,
  propertyCategories,
  propertyStatuses,
} from '@/data/properties';

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'По дата (най-нови)' },
  { value: 'date-asc', label: 'По дата (най-стари)' },
  { value: 'title-asc', label: 'По име (А-Я)' },
  { value: 'title-desc', label: 'По име (Я-А)' },
  { value: 'price-asc', label: 'По цена (възходящо)' },
  { value: 'price-desc', label: 'По цена (низходящо)' },
  { value: 'city-asc', label: 'По град (А-Я)' },
];

const inputClass =
  'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
const selectClass =
  'rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white';

export default function AdminPropertiesToolbar({ properties = [], isDemo = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const uniqueCities = useMemo(() => {
    const cities = [...new Set(properties.map((p) => p.city).filter(Boolean))];
    return cities.sort((a, b) => a.localeCompare(b));
  }, [properties]);

  const filteredAndSorted = useMemo(() => {
    let list = [...(properties || [])];

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.slug && p.slug.toLowerCase().includes(q)) ||
          (p.address && p.address.toLowerCase().includes(q))
      );
    }
    if (categoryFilter) list = list.filter((p) => p.category === categoryFilter);
    if (typeFilter) list = list.filter((p) => p.type === typeFilter);
    if (statusFilter) list = list.filter((p) => p.status === statusFilter);
    if (cityFilter) list = list.filter((p) => p.city === cityFilter);

    switch (sortBy) {
      case 'date-desc':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'date-asc':
        list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
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
  }, [properties, searchQuery, sortBy, categoryFilter, typeFilter, statusFilter, cityFilter]);

  return (
    <div className="space-y-4">
      {/* Търсене и филтри */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Търсене по име */}
          <div className="min-w-[200px] flex-1">
            <label htmlFor="admin-search" className="mb-1 block text-xs font-medium text-gray-600">
              Търсене по име / адрес
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="admin-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Заглавие, slug или адрес..."
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          {/* Сортиране */}
          <div className="w-48">
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

          {/* Категория */}
          <div className="w-36">
            <label htmlFor="admin-category" className="mb-1 block text-xs font-medium text-gray-600">
              Категория
            </label>
            <select
              id="admin-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={selectClass}
            >
              <option value="">Всички</option>
              {propertyCategories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Тип */}
          <div className="w-36">
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
          <div className="w-36">
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
          <div className="w-36">
            <label htmlFor="admin-city" className="mb-1 block text-xs font-medium text-gray-600">
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
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Показани: {filteredAndSorted.length} от {properties.length} имота
        </p>
      </div>

      <PropertyTable properties={filteredAndSorted} isDemo={isDemo} />
    </div>
  );
}
