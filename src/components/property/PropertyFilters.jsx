'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import PropertyGrid from './PropertyGrid';
import { propertyTypes, cities } from '@/data/properties';
import { getTranslations } from '@/lib/translations';
import {
  FunnelIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const countStyle = 'text-graphite-light';
const countNumber = 'font-semibold text-graphite';

function buildSortOptions(t) {
  return [
    { value: 'price-asc', label: t.priceAsc },
    { value: 'price-desc', label: t.priceDesc },
    { value: 'area-asc', label: t.areaAsc },
    { value: 'area-desc', label: t.areaDesc },
    { value: 'date-desc', label: t.dateDesc },
    { value: 'date-asc', label: t.dateAsc },
    { value: 'title-asc', label: t.titleAsc },
  ];
}

function buildRoomsOptions(t) {
  return [
    { value: '', label: t.roomsAny },
    { value: '1', label: t.rooms1 },
    { value: '2', label: t.rooms2 },
    { value: '3', label: t.rooms3 },
    { value: '4', label: t.rooms4 },
  ];
}

function buildSalePriceRanges(t) {
  return [
    { value: '', label: t.allPrices },
    { value: '0-50000', label: t.priceUpTo50k, min: 0, max: 50000 },
    { value: '50000-100000', label: t.price50to100, min: 50000, max: 100000 },
    { value: '100000-200000', label: t.price100to200, min: 100000, max: 200000 },
    { value: '200000+', label: t.price200plus, min: 200000, max: Infinity },
  ];
}

function buildRentPriceRanges(t) {
  return [
    { value: '', label: t.allPrices },
    { value: '0-500', label: t.rentUpTo500, min: 0, max: 500 },
    { value: '500-1000', label: t.rent500to1000, min: 500, max: 1000 },
    { value: '1000-2000', label: t.rent1000to2000, min: 1000, max: 2000 },
    { value: '2000+', label: t.rent2000plus, min: 2000, max: Infinity },
  ];
}

export default function PropertyFilters({
  properties,
  emptyMessage = 'Няма намерени имоти',
  category = 'sale',
  animateCards = false,
  locale = 'bg',
}) {
  const t = getTranslations(locale).filters;
  const SORT_OPTIONS = useMemo(() => buildSortOptions(t), [locale]);
  const ROOMS_OPTIONS = useMemo(() => buildRoomsOptions(t), [locale]);
  const SALE_PRICE_RANGES = useMemo(() => buildSalePriceRanges(t), [locale]);
  const RENT_PRICE_RANGES = useMemo(() => buildRentPriceRanges(t), [locale]);
  const priceRangesStatic = category === 'rent' ? RENT_PRICE_RANGES : SALE_PRICE_RANGES;
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    neighborhood: '',
    priceRange: '',
    rooms: '',
    minArea: '',
    maxArea: '',
    yearFrom: '',
    yearTo: '',
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

  const updateFilter = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'city') next.neighborhood = '';
      return next;
    });
  };

  const neighborhoodsInCity = useMemo(() => {
    if (!filters.city) return [];
    const set = new Set();
    properties.forEach((p) => {
      if (p.city === filters.city && p.neighborhood) set.add(p.neighborhood);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [filters.city, properties]);

  const clearExtraFilters = () => {
    setFilters((prev) => ({
      ...prev,
      type: '',
      city: '',
      neighborhood: '',
      priceRange: '',
      rooms: '',
      minArea: '',
      maxArea: '',
      yearFrom: '',
      yearTo: '',
    }));
  };

  const hasExtraFilters =
    filters.type ||
    filters.city ||
    filters.neighborhood ||
    filters.priceRange ||
    filters.rooms ||
    filters.minArea ||
    filters.maxArea ||
    filters.yearFrom ||
    filters.yearTo;

  const filteredProperties = useMemo(() => {
    let list = properties.filter((property) => {
      if (filters.type && property.type !== filters.type) return false;
      if (filters.city && property.city !== filters.city) return false;
      if (filters.neighborhood && property.neighborhood !== filters.neighborhood) return false;
      if (filters.priceRange) {
        const range = priceRangesStatic.find((r) => r.value === filters.priceRange);
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
      if (filters.yearFrom) {
        const from = Number(filters.yearFrom);
        if (!isNaN(from) && (property.yearBuilt ?? 0) < from) return false;
      }
      if (filters.yearTo) {
        const to = Number(filters.yearTo);
        if (!isNaN(to) && (property.yearBuilt ?? 0) > to) return false;
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
  }, [properties, filters, priceRangesStatic, sortBy]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? t.sort;

  return (
    <>
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-end">
            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
              <div className={`${countStyle} shrink-0`}>
                <span className={countNumber}>{filteredProperties.length}</span> {t.foundCount}
              </div>
              <div className="flex flex-wrap gap-3 items-center justify-end">
              {/* Сортиране – По дата (най-нови) */}
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
                    className="absolute right-0 top-full mt-1 min-w-[200px] py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
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

              {/* Допълнителни филтри – Филтри */}
              <div className="relative" ref={filterRef}>
                <button
                  type="button"
                  onClick={() => setExtraFiltersOpen((v) => !v)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${extraFiltersOpen || hasExtraFilters ? 'border-graphite bg-gray-50' : 'border-gray-200 hover:border-graphite/50'} text-graphite bg-white focus:ring-2 focus:ring-graphite/20 focus:border-graphite`}
                  aria-expanded={extraFiltersOpen}
                >
                  <FunnelIcon className="w-5 h-5 shrink-0" />
                  <span className="hidden sm:inline">{t.filters}</span>
                  {hasExtraFilters && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-medium rounded-full bg-graphite text-white">
                      !
                    </span>
                  )}
                  <ChevronDownIcon className={`w-4 h-4 shrink-0 transition-transform ${extraFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
                {extraFiltersOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden max-h-[90vh] flex flex-col">
                    <div className="p-4 bg-gray-50/80 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-graphite">{t.filters}</h3>
                      <p className="text-xs text-graphite-light mt-0.5">{t.filtersSubtitle}</p>
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto">
                      {/* Първи: Тип, Град, Квартал (ако има град), Цена */}
                      <div className="space-y-3 pb-4 border-b border-gray-100">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{t.type}</label>
                          <select
                            value={filters.type ?? ''}
                            onChange={(e) => updateFilter('type', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-graphite bg-white focus:ring-2 focus:ring-graphite/20 focus:border-graphite transition-colors"
                          >
                            <option value="">{t.allTypes}</option>
                            {propertyTypes.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{t.city}</label>
                          <select
                            value={filters.city ?? ''}
                            onChange={(e) => updateFilter('city', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-graphite bg-white focus:ring-2 focus:ring-graphite/20 focus:border-graphite transition-colors"
                          >
                            <option value="">{t.allCities}</option>
                            {cities.map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                            <label className={`block text-xs font-medium mb-1.5 ${filters.city ? 'text-gray-600' : 'text-gray-400'}`}>
                              {t.neighborhood}
                            </label>
                            <select
                              value={filters.neighborhood ?? ''}
                              onChange={(e) => updateFilter('neighborhood', e.target.value)}
                              disabled={!filters.city}
                              className={`w-full px-3 py-2.5 border rounded-lg transition-colors ${
                                filters.city
                                  ? 'border-gray-200 text-graphite bg-white focus:ring-2 focus:ring-graphite/20 focus:border-graphite'
                                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <option value="">
                                {filters.city ? t.allNeighborhoods : t.selectCityFirst}
                              </option>
                              {neighborhoodsInCity.map((nb) => (
                                <option key={nb} value={nb}>
                                  {nb}
                                </option>
                              ))}
                            </select>
                          </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{t.priceLabel}</label>
                          <select
                            value={filters.priceRange ?? ''}
                            onChange={(e) => updateFilter('priceRange', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-graphite bg-white focus:ring-2 focus:ring-graphite/20 focus:border-graphite transition-colors"
                          >
                            {priceRangesStatic.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">{t.rooms}</label>
                        <select
                          value={filters.rooms ?? ''}
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
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{t.minArea}</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="мин"
                            value={filters.minArea ?? ''}
                            onChange={(e) => updateFilter('minArea', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-graphite focus:ring-2 focus:ring-graphite/20 focus:border-graphite transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{t.maxArea}</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="макс"
                            value={filters.maxArea ?? ''}
                            onChange={(e) => updateFilter('maxArea', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-graphite focus:ring-2 focus:ring-graphite/20 focus:border-graphite transition-colors"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{t.yearFrom}</label>
                          <input
                            type="number"
                            min="1900"
                            max="2100"
                            placeholder="напр. 2015"
                            value={filters.yearFrom ?? ''}
                            onChange={(e) => updateFilter('yearFrom', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-graphite focus:ring-2 focus:ring-graphite/20 focus:border-graphite transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">{t.yearTo}</label>
                          <input
                            type="number"
                            min="1900"
                            max="2100"
                            placeholder="2026"
                            value={filters.yearTo ?? ''}
                            onChange={(e) => updateFilter('yearTo', e.target.value)}
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
                          {t.clearFilters}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <PropertyGrid
            properties={filteredProperties}
            emptyMessage={emptyMessage}
            animateCards={animateCards}
            showDescription={false}
            locale={locale}
          />
        </div>
      </section>
    </>
  );
}
