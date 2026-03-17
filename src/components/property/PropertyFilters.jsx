'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import PropertyGrid from './PropertyGrid';
import { propertyTypes, cities, constructionTypes, yearBuiltStatuses } from '@/data/properties';
import { getTranslations } from '@/lib/translations';
import {
  FunnelIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const countStyle = 'text-graphite-light';
const countNumber = 'text-graphite';

// Дропдауни във филтрите – в нашия стил, но леки (без тежки сенки)
const filterSelectClass =
  'w-full px-3.5 py-2.5 bg-white/90 border border-gray-200/80 rounded-lg text-graphite text-sm transition-colors duration-200 ' +
  'hover:border-cadetblue/30 focus:border-cadetblue/70 focus:ring-2 focus:ring-cadetblue/15 focus:outline-none';
const filterSelectDisabledClass =
  'w-full px-3.5 py-2.5 border border-gray-200/80 rounded-lg bg-gray-50/80 text-gray-400 cursor-not-allowed text-sm';
const filterInputClass =
  'w-full px-3.5 py-2.5 bg-white/90 border border-gray-200/80 rounded-lg text-graphite text-sm transition-colors duration-200 ' +
  'hover:border-cadetblue/30 focus:border-cadetblue/70 focus:ring-2 focus:ring-cadetblue/15 focus:outline-none placeholder:text-gray-400';

function getPricePerSqm(property) {
  const area = property.area ?? 0;
  if (!area || area <= 0) return null;
  return (property.price ?? 0) / area;
}

function buildSortOptions(t) {
  return [
    { value: 'price-asc', label: t.priceAsc },
    { value: 'price-desc', label: t.priceDesc },
    { value: 'pricePerSqm-asc', label: t.pricePerSqmAsc },
    { value: 'pricePerSqm-desc', label: t.pricePerSqmDesc },
    { value: 'area-asc', label: t.areaAsc },
    { value: 'area-desc', label: t.areaDesc },
    { value: 'floor-asc', label: t.floorAsc },
    { value: 'floor-desc', label: t.floorDesc },
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
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    neighborhood: '',
    minPrice: '',
    maxPrice: '',
    rooms: '',
    minArea: '',
    maxArea: '',
    minFloor: '',
    maxFloor: '',
    minPricePerSqm: '',
    maxPricePerSqm: '',
    yearFrom: '',
    yearTo: '',
    gaz: '',
    tec: '',
    constructionType: '',
    yearBuiltStatus: '',
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
      minPrice: '',
      maxPrice: '',
      rooms: '',
      minArea: '',
      maxArea: '',
      minFloor: '',
      maxFloor: '',
      minPricePerSqm: '',
      maxPricePerSqm: '',
      yearFrom: '',
      yearTo: '',
      gaz: '',
      tec: '',
      constructionType: '',
      yearBuiltStatus: '',
    }));
  };

  const hasExtraFilters =
    filters.type ||
    filters.city ||
    filters.neighborhood ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.rooms ||
    filters.minArea ||
    filters.maxArea ||
    filters.minFloor ||
    filters.maxFloor ||
    filters.minPricePerSqm ||
    filters.maxPricePerSqm ||
    filters.yearFrom ||
    filters.yearTo ||
    filters.gaz ||
    filters.tec ||
    filters.constructionType ||
    filters.yearBuiltStatus;

  const filteredProperties = useMemo(() => {
    let list = properties.filter((property) => {
      if (filters.type && property.type !== filters.type) return false;
      if (filters.city && property.city !== filters.city) return false;
      if (filters.neighborhood && property.neighborhood !== filters.neighborhood) return false;
      const price = property.price ?? 0;
      if (filters.minPrice) {
        const min = Number(filters.minPrice);
        if (!isNaN(min) && price < min) return false;
      }
      if (filters.maxPrice) {
        const max = Number(filters.maxPrice);
        if (!isNaN(max) && price > max) return false;
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
      const floor = property.floor;
      if (filters.minFloor !== '' && filters.minFloor != null) {
        const min = Number(filters.minFloor);
        if (!isNaN(min) && (floor == null || floor < min)) return false;
      }
      if (filters.maxFloor !== '' && filters.maxFloor != null) {
        const max = Number(filters.maxFloor);
        if (!isNaN(max) && (floor == null || floor > max)) return false;
      }
      const pricePerSqm = getPricePerSqm(property);
      if (filters.minPricePerSqm) {
        const min = Number(filters.minPricePerSqm);
        if (!isNaN(min) && (pricePerSqm == null || pricePerSqm < min)) return false;
      }
      if (filters.maxPricePerSqm) {
        const max = Number(filters.maxPricePerSqm);
        if (!isNaN(max) && (pricePerSqm == null || pricePerSqm > max)) return false;
      }
      if (filters.yearFrom) {
        const from = Number(filters.yearFrom);
        if (!isNaN(from) && (property.yearBuilt ?? 0) < from) return false;
      }
      if (filters.yearTo) {
        const to = Number(filters.yearTo);
        if (!isNaN(to) && (property.yearBuilt ?? 0) > to) return false;
      }
      if (filters.gaz === 'yes' && !property.gaz) return false;
      if (filters.gaz === 'no' && property.gaz) return false;
      if (filters.tec === 'yes' && !property.tec) return false;
      if (filters.tec === 'no' && property.tec) return false;
      if (filters.constructionType && (property.constructionType ?? '') !== filters.constructionType) return false;
      if (filters.yearBuiltStatus && (property.yearBuiltStatus ?? '') !== filters.yearBuiltStatus) return false;
      return true;
    });

    switch (sortBy) {
      case 'price-asc':
        list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'pricePerSqm-asc':
        list = [...list].sort((a, b) => (getPricePerSqm(a) ?? 0) - (getPricePerSqm(b) ?? 0));
        break;
      case 'pricePerSqm-desc':
        list = [...list].sort((a, b) => (getPricePerSqm(b) ?? 0) - (getPricePerSqm(a) ?? 0));
        break;
      case 'area-asc':
        list = [...list].sort((a, b) => (a.area ?? 0) - (b.area ?? 0));
        break;
      case 'area-desc':
        list = [...list].sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
        break;
      case 'floor-asc':
        list = [...list].sort((a, b) => (a.floor ?? -1) - (b.floor ?? -1));
        break;
      case 'floor-desc':
        list = [...list].sort((a, b) => (b.floor ?? -1) - (a.floor ?? -1));
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
  }, [properties, filters, sortBy]);

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
                  className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all duration-200 shadow-sm ${sortOpen ? 'border-cadetblue bg-cadetblue/5 shadow' : 'border-gray-200/90 hover:border-cadetblue/50 hover:shadow'} text-graphite bg-white focus:ring-2 focus:ring-cadetblue/20 focus:border-cadetblue focus:outline-none`}
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
                    className="absolute right-0 top-full mt-1.5 min-w-[220px] py-1.5 bg-white border border-gray-200/90 rounded-xl shadow-xl z-50"
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
                          className={`w-full text-left px-4 py-2.5 text-sm rounded-lg mx-1 ${sortBy === opt.value ? 'bg-cadetblue/10 text-cadetblue-dark' : 'text-graphite hover:bg-cadetblue/5 hover:text-graphite-dark'}`}
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
                  className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all duration-200 shadow-sm ${extraFiltersOpen || hasExtraFilters ? 'border-cadetblue bg-cadetblue/5 shadow' : 'border-gray-200/90 hover:border-cadetblue/50 hover:shadow'} text-graphite bg-white focus:ring-2 focus:ring-cadetblue/20 focus:border-cadetblue focus:outline-none`}
                  aria-expanded={extraFiltersOpen}
                >
                  <FunnelIcon className="w-5 h-5 shrink-0" />
                  <span className="hidden sm:inline">{t.filters}</span>
                  {hasExtraFilters && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs rounded-full bg-cadetblue text-white">
                      !
                    </span>
                  )}
                  <ChevronDownIcon className={`w-4 h-4 shrink-0 transition-transform ${extraFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
                {extraFiltersOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96 rounded-2xl border border-gray-200/90 bg-white shadow-xl z-50 overflow-hidden max-h-[90vh] flex flex-col">
                    <div className="p-4 bg-gradient-to-b from-cadetblue/5 to-transparent border-b border-gray-100">
                      <h3 className="text-sm text-graphite">{t.filters}</h3>
                      <p className="text-xs text-graphite-light mt-0.5">{t.filtersSubtitle}</p>
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto">
                      {/* Първи: Тип, Град, Квартал (ако има град), Цена */}
                      <div className="space-y-3 pb-4 border-b border-gray-100">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.type}</label>
                          <select
                            value={filters.type ?? ''}
                            onChange={(e) => updateFilter('type', e.target.value)}
                            className={filterSelectClass}
                          >
                            <option value="">{t.allTypes}</option>
                            {propertyTypes.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {getTranslations(locale)?.property?.[opt.value] ?? opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.city}</label>
                          <select
                            value={filters.city ?? ''}
                            onChange={(e) => updateFilter('city', e.target.value)}
                            className={filterSelectClass}
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
                            <label className={`block text-xs mb-1.5 ${filters.city ? 'text-gray-500' : 'text-gray-400'}`}>
                              {t.neighborhood}
                            </label>
                            <select
                              value={filters.neighborhood ?? ''}
                              onChange={(e) => updateFilter('neighborhood', e.target.value)}
                              disabled={!filters.city}
                              className={filters.city ? filterSelectClass : filterSelectDisabledClass}
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
                        <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{category === 'rent' ? t.rentLabel : t.priceLabel} – {t.priceFrom}</label>
                          <input
                            type="number"
                            min="0"
                            step={category === 'rent' ? '50' : '1000'}
                            placeholder={category === 'rent' ? 'напр. 300' : 'напр. 50000'}
                            value={filters.minPrice ?? ''}
                            onChange={(e) => updateFilter('minPrice', e.target.value)}
                            className={filterInputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{category === 'rent' ? t.rentLabel : t.priceLabel} – {t.priceTo}</label>
                          <input
                            type="number"
                            min="0"
                            step={category === 'rent' ? '50' : '1000'}
                            placeholder={category === 'rent' ? 'напр. 1500' : 'напр. 200000'}
                            value={filters.maxPrice ?? ''}
                            onChange={(e) => updateFilter('maxPrice', e.target.value)}
                            className={filterInputClass}
                          />
                        </div>
                      </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">{t.rooms}</label>
                        <select
                          value={filters.rooms ?? ''}
                          onChange={(e) => updateFilter('rooms', e.target.value)}
                          className={filterSelectClass}
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
                          <label className="block text-xs text-gray-500 mb-1.5">{t.areaFrom}</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="от"
                            value={filters.minArea ?? ''}
                            onChange={(e) => updateFilter('minArea', e.target.value)}
                            className={filterInputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.areaTo}</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="до"
                            value={filters.maxArea ?? ''}
                            onChange={(e) => updateFilter('maxArea', e.target.value)}
                            className={filterInputClass}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.floorFrom}</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="напр. 0"
                            value={filters.minFloor ?? ''}
                            onChange={(e) => updateFilter('minFloor', e.target.value)}
                            className={filterInputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.floorTo}</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="напр. 5"
                            value={filters.maxFloor ?? ''}
                            onChange={(e) => updateFilter('maxFloor', e.target.value)}
                            className={filterInputClass}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.minPricePerSqm}</label>
                          <input
                            type="number"
                            min="0"
                            step="100"
                            placeholder="от"
                            value={filters.minPricePerSqm ?? ''}
                            onChange={(e) => updateFilter('minPricePerSqm', e.target.value)}
                            className={filterInputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.maxPricePerSqm}</label>
                          <input
                            type="number"
                            min="0"
                            step="100"
                            placeholder="до"
                            value={filters.maxPricePerSqm ?? ''}
                            onChange={(e) => updateFilter('maxPricePerSqm', e.target.value)}
                            className={filterInputClass}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.yearFrom}</label>
                          <input
                            type="number"
                            min="1900"
                            max="2100"
                            placeholder="напр. 2015"
                            value={filters.yearFrom ?? ''}
                            onChange={(e) => updateFilter('yearFrom', e.target.value)}
                            className={filterInputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.yearTo}</label>
                          <input
                            type="number"
                            min="1900"
                            max="2100"
                            placeholder="2026"
                            value={filters.yearTo ?? ''}
                            onChange={(e) => updateFilter('yearTo', e.target.value)}
                            className={filterInputClass}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.gaz}</label>
                          <select
                            value={filters.gaz ?? ''}
                            onChange={(e) => updateFilter('gaz', e.target.value)}
                            className={filterSelectClass}
                          >
                            <option value="">{t.filterStatusAny}</option>
                            <option value="yes">{t.filterStatusYes}</option>
                            <option value="no">{t.filterStatusNo}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">{t.tec}</label>
                          <select
                            value={filters.tec ?? ''}
                            onChange={(e) => updateFilter('tec', e.target.value)}
                            className={filterSelectClass}
                          >
                            <option value="">{t.filterStatusAny}</option>
                            <option value="yes">{t.filterStatusYes}</option>
                            <option value="no">{t.filterStatusNo}</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">{t.constructionType}</label>
                        <select
                          value={filters.constructionType ?? ''}
                          onChange={(e) => updateFilter('constructionType', e.target.value)}
                          className={filterSelectClass}
                        >
                          <option value="">{t.constructionTypeAny}</option>
                          {constructionTypes.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {getTranslations(locale)?.property?.[`constructionType_${opt.value}`] ?? opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">{t.constructionStage}</label>
                        <select
                          value={filters.yearBuiltStatus ?? ''}
                          onChange={(e) => updateFilter('yearBuiltStatus', e.target.value)}
                          className={filterSelectClass}
                        >
                          <option value="">{t.constructionStageAny}</option>
                          <option value="completed">{t.constructionStageCompleted}</option>
                          <option value="under_construction">{t.constructionStageUnderConstruction}</option>
                          <option value="not_in_use">{t.constructionStageNotInUse}</option>
                        </select>
                      </div>
                      {hasExtraFilters && (
                        <button
                          type="button"
                          onClick={() => {
                            clearExtraFilters();
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm text-graphite-light hover:text-cadetblue border border-gray-200/90 rounded-xl hover:bg-cadetblue/5 transition-all duration-200"
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
