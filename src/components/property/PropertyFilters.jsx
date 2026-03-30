'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import PropertyGrid from './PropertyGrid';
import { propertyTypes, cities, constructionTypes } from '@/data/properties';
import { getTranslations } from '@/lib/translations';
import {
  ArrowsUpDownIcon,
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const countStyle = 'text-graphite-light';
const countNumber = 'text-graphite';

// Дропдауни във филтрите – в нашия стил, но леки (без тежки сенки)
const filterSelectClass =
  'w-full px-3.5 py-2.5 bg-white/90 border border-gray-200/80 rounded-lg text-graphite text-sm transition-colors duration-200 ' +
  'hover:border-cadetblue/30 focus:border-cadetblue/70 focus:ring-2 focus:ring-cadetblue/15 focus:outline-none';
const filterInputClass =
  'w-full px-3.5 py-2.5 bg-white/90 border border-gray-200/80 rounded-lg text-graphite text-sm transition-colors duration-200 ' +
  'hover:border-cadetblue/30 focus:border-cadetblue/70 focus:ring-2 focus:ring-cadetblue/15 focus:outline-none placeholder:text-gray-400';

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase();
}

function includesSearch(query, ...values) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  return values.some((value) => normalizeText(value).includes(normalizedQuery));
}

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
    codeSearch: '',
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
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [neighborhoodDropdownOpen, setNeighborhoodDropdownOpen] = useState(false);
  const sortRef = useRef(null);
  const cityRef = useRef(null);
  const neighborhoodRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityDropdownOpen(false);
      if (neighborhoodRef.current && !neighborhoodRef.current.contains(e.target)) setNeighborhoodDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const displayCityName = (p) => (locale === 'en' ? (p.cityEn || p.city) : p.city);
  const displayNeighborhoodName = (p) =>
    locale === 'en' ? (p.neighborhoodEn || p.neighborhood) : p.neighborhood;

  const cityOptions = useMemo(() => {
    const set = new Set();
    if (locale === 'en') {
      properties.forEach((p) => {
        const name = displayCityName(p);
        if (name) set.add(name);
      });
    } else {
      cities.forEach((c) => {
        if (c?.label) set.add(c.label);
      });
      properties.forEach((p) => {
        if (p?.city) set.add(p.city);
      });
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [properties, locale]);

  const cityQuery = normalizeText(filters.city);
  const neighborhoodQuery = normalizeText(filters.neighborhood);

  const citySuggestions = useMemo(() => {
    const base = cityQuery
      ? cityOptions.filter(
          (cityName) =>
            properties.some(
              (p) =>
                normalizeText(displayCityName(p)) === normalizeText(cityName) &&
                includesSearch(cityQuery, p.city, p.cityEn)
            ) || includesSearch(cityQuery, cityName)
        )
      : cityOptions;
    return base.slice(0, 12);
  }, [cityOptions, cityQuery, properties, locale]);

  const neighborhoodSuggestions = useMemo(() => {
    const set = new Set();
    properties.forEach((p) => {
      const nb = displayNeighborhoodName(p);
      if (!normalizeText(nb)) return;
      if (cityQuery && !includesSearch(cityQuery, p.city, p.cityEn)) return;
      if (neighborhoodQuery && !includesSearch(neighborhoodQuery, p.neighborhood, p.neighborhoodEn)) return;
      set.add(nb);
    });
    return [...set].sort((a, b) => a.localeCompare(b)).slice(0, 12);
  }, [properties, cityQuery, neighborhoodQuery, locale]);

  const propertyTypeAliasToOption = useMemo(() => {
    const map = new Map();
    propertyTypes.forEach((opt) => {
      const aliases = [
        opt.value,
        opt.label,
        getTranslations(locale)?.property?.[opt.value],
      ];
      aliases.forEach((alias) => {
        const key = normalizeText(alias);
        if (key) map.set(key, opt);
      });
    });
    return map;
  }, [locale]);

  const clearExtraFilters = () => {
    setFilters((prev) => ({
      ...prev,
      codeSearch: '',
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
    filters.codeSearch ||
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
      const codeQ = filters.codeSearch?.trim().toLowerCase();
      if (codeQ) {
        const propCode = property.code != null ? String(property.code).trim().toLowerCase() : '';
        if (!propCode || !propCode.includes(codeQ)) return false;
      }
      if (filters.type) {
        const selectedType = normalizeText(filters.type);
        const propertyType = normalizeText(property.type);
        const selectedOption = propertyTypeAliasToOption.get(selectedType);
        const propertyOption = propertyTypeAliasToOption.get(propertyType);

        if (selectedOption && propertyOption) {
          const selectedGroup = normalizeText(selectedOption.label);
          const propertyGroup = normalizeText(propertyOption.label);
          if (selectedGroup !== propertyGroup) return false;
        } else if (selectedType !== propertyType) {
          return false;
        }
      }
      const cityFilterQ = normalizeText(filters.city);
      const neighborhoodFilterQ = normalizeText(filters.neighborhood);
      if (cityFilterQ && !includesSearch(cityFilterQ, property.city, property.cityEn)) return false;
      if (neighborhoodFilterQ && !includesSearch(neighborhoodFilterQ, property.neighborhood, property.neighborhoodEn)) return false;
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
  }, [properties, filters, sortBy, propertyTypeAliasToOption]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? t.sort;

  return (
    <>
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="mb-4 w-full max-w-md">
            <label htmlFor="filter-code-search" className="mb-1 block text-sm font-medium text-graphite">
              {t.searchByCode}
            </label>
            <div className="relative">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                id="filter-code-search"
                type="search"
                autoComplete="off"
                value={filters.codeSearch}
                onChange={(e) => updateFilter('codeSearch', e.target.value)}
                placeholder={t.codePlaceholder}
                className={`${filterInputClass} pl-10`}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <div className={`${countStyle} shrink-0`}>
              <span className={countNumber}>{filteredProperties.length}</span> {t.foundCount}
            </div>
            <div className="flex w-full flex-wrap gap-3 items-center justify-end sm:w-auto sm:min-w-0">
            <button
              type="button"
              onClick={() => setFiltersPanelOpen((v) => !v)}
              aria-expanded={filtersPanelOpen}
              aria-controls="property-filters-panel"
              className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all duration-200 shadow-sm ${filtersPanelOpen || hasExtraFilters ? 'border-cadetblue bg-cadetblue/5 shadow' : 'border-gray-200/90 hover:border-cadetblue/50 hover:shadow'} text-graphite bg-white focus:ring-2 focus:ring-cadetblue/20 focus:border-cadetblue focus:outline-none`}
            >
              <FunnelIcon className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline">{filtersPanelOpen ? t.hideFiltersPanel : t.showFiltersPanel}</span>
              {hasExtraFilters && (
                <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs rounded-full bg-cadetblue text-white">
                  !
                </span>
              )}
              <ChevronDownIcon
                className={`w-4 h-4 shrink-0 transition-transform duration-300 ${filtersPanelOpen ? 'rotate-180' : ''}`}
              />
            </button>
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
            </div>
          </div>

          {/* Филтри – скрити по подразбиране; същото съдържание като преди */}
          <div
            id="property-filters-panel"
            className={`overflow-hidden transition-[max-height] duration-500 ease-in-out motion-reduce:transition-none ${filtersPanelOpen ? 'max-h-[10000px] mt-6' : 'max-h-0 mt-0'}`}
            aria-hidden={!filtersPanelOpen}
          >
          <div className="w-full rounded-2xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 md:px-6 md:py-4 bg-gradient-to-b from-cadetblue/5 to-transparent border-b border-gray-100 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-graphite">{t.filters}</h3>
                <p className="text-xs text-graphite-light mt-0.5">{t.filtersSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => clearExtraFilters()}
                disabled={!hasExtraFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-graphite-light hover:text-cadetblue border-gray-200/90 hover:bg-cadetblue/5"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
                {t.resetFilters}
              </button>
            </div>
            <div className="p-4 md:p-6">
              {/* Основни филтри: вид, етап, град, квартал | цена, стаи, тип строителство */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                <div className="relative" ref={cityRef}>
                  <label className="block text-xs text-gray-500 mb-1.5">{t.city}</label>
                  <input
                    type="text"
                    value={filters.city ?? ''}
                    onChange={(e) => {
                      updateFilter('city', e.target.value);
                      setCityDropdownOpen(true);
                    }}
                    onFocus={() => setCityDropdownOpen(true)}
                    placeholder={t.allCities}
                    className={filterInputClass}
                    autoComplete="off"
                  />
                  {cityDropdownOpen && citySuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200/90 bg-white shadow-lg">
                      {citySuggestions.map((cityName) => (
                        <button
                          key={cityName}
                          type="button"
                          onClick={() => {
                            updateFilter('city', cityName);
                            setCityDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-graphite hover:bg-cadetblue/5"
                        >
                          {cityName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative" ref={neighborhoodRef}>
                  <label className="block text-xs text-gray-500 mb-1.5">{t.neighborhood}</label>
                  <input
                    type="text"
                    value={filters.neighborhood ?? ''}
                    onChange={(e) => {
                      updateFilter('neighborhood', e.target.value);
                      setNeighborhoodDropdownOpen(true);
                    }}
                    onFocus={() => setNeighborhoodDropdownOpen(true)}
                    placeholder={t.allNeighborhoods}
                    className={filterInputClass}
                    autoComplete="off"
                  />
                  {neighborhoodDropdownOpen && neighborhoodSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200/90 bg-white shadow-lg">
                      {neighborhoodSuggestions.map((nb) => (
                        <button
                          key={nb}
                          type="button"
                          onClick={() => {
                            updateFilter('neighborhood', nb);
                            setNeighborhoodDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-graphite hover:bg-cadetblue/5"
                        >
                          {nb}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">
                        {category === 'rent' ? t.rentLabel : t.priceLabel} – {t.priceFrom}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step={category === 'rent' ? '50' : '1000'}
                        placeholder={category === 'rent' ? t.pricePlaceholderMinRent : t.pricePlaceholderMinSale}
                        value={filters.minPrice ?? ''}
                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                        className={filterInputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">
                        {category === 'rent' ? t.rentLabel : t.priceLabel} – {t.priceTo}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step={category === 'rent' ? '50' : '1000'}
                        placeholder={category === 'rent' ? t.pricePlaceholderMaxRent : t.pricePlaceholderMaxSale}
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
              </div>

              <div
                id="property-filters-more"
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out motion-reduce:transition-none ${filtersExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}
                aria-hidden={!filtersExpanded}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 mt-4 border-t border-gray-100">
                  <div className="sm:col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">{t.areaFrom}</label>
                        <input
                          type="number"
                          min="0"
                          placeholder={t.placeholderFrom}
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
                          placeholder={t.placeholderTo}
                          value={filters.maxArea ?? ''}
                          onChange={(e) => updateFilter('maxArea', e.target.value)}
                          className={filterInputClass}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">{t.floorFrom}</label>
                        <input
                          type="number"
                          min="0"
                          placeholder={t.floorPlaceholderFrom}
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
                          placeholder={t.floorPlaceholderTo}
                          value={filters.maxFloor ?? ''}
                          onChange={(e) => updateFilter('maxFloor', e.target.value)}
                          className={filterInputClass}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">{t.minPricePerSqm}</label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          placeholder={t.placeholderFrom}
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
                          placeholder={t.placeholderTo}
                          value={filters.maxPricePerSqm ?? ''}
                          onChange={(e) => updateFilter('maxPricePerSqm', e.target.value)}
                          className={filterInputClass}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">{t.yearFrom}</label>
                        <input
                          type="number"
                          min="1900"
                          max="2100"
                          placeholder={t.yearPlaceholderFrom}
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
                          placeholder={t.yearPlaceholderTo}
                          value={filters.yearTo ?? ''}
                          onChange={(e) => updateFilter('yearTo', e.target.value)}
                          className={filterInputClass}
                        />
                      </div>
                    </div>
                  </div>
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
              </div>

              <div className="flex justify-end mt-4 pt-3 border-t border-gray-100/90">
                <button
                  type="button"
                  onClick={() => setFiltersExpanded((v) => !v)}
                  aria-expanded={filtersExpanded}
                  aria-controls="property-filters-more"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-cadetblue-dark hover:text-cadetblue border border-cadetblue/30 rounded-xl hover:bg-cadetblue/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cadetblue/30"
                >
                  {filtersExpanded ? t.hideMoreFilters : t.showMoreFilters}
                  <ChevronDownIcon
                    className={`w-4 h-4 shrink-0 transition-transform duration-500 ease-in-out ${filtersExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
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
            showStreetAddress={false}
            showFloorAndConstruction
          />
        </div>
      </section>
    </>
  );
}
