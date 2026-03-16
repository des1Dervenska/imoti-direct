'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  propertyTypes,
  propertyCategories,
  propertyStatuses,
  constructionTypes,
  yearBuiltStatuses,
  PROPERTY_STATUS,
} from '@/data/properties';
import { createProperty, updateProperty } from '@/lib/properties';
import ImageUpload from './ImageUpload';

export default function PropertyForm({ property = null, isDemo = false }) {
  const router = useRouter();
  const isEditing = Boolean(property);

  const [formData, setFormData] = useState({
    title: property?.title || '',
    titleEn: property?.titleEn || '',
    slug: property?.slug || '',
    category: property?.category || 'sale',
    type: property?.type || 'apartment',
    status: property?.status || PROPERTY_STATUS.ACTIVE,
    price: property?.price || '',
    currency: 'EUR',
    area: property?.area || '',
    rooms: property?.rooms || '',
    floor: property?.floor || '',
    totalFloors: property?.totalFloors || '',
    yearBuilt: property?.yearBuilt || '',
    yearBuiltStatus: property?.yearBuiltStatus ?? '',
    city: property?.city || '',
    cityEn: property?.cityEn || '',
    neighborhood: property?.neighborhood || '',
    neighborhoodEn: property?.neighborhoodEn || '',
    address: property?.address || '',
    addressEn: property?.addressEn || '',
    description: property?.description || '',
    descriptionEn: property?.descriptionEn || '',
    features: property?.features?.join(', ') || '',
    featuresEn: property?.featuresEn?.join(', ') || '',
    images: property?.images || [],
    mapUrl: property?.mapUrl || '',
    videoUrl: property?.videoUrl || '',
    isFeatured: property?.isFeatured || false,
    gaz: property?.gaz ?? false,
    tec: property?.tec ?? false,
    priceIncludesVat: property?.priceIncludesVat ?? false,
    constructionType: property?.constructionType ?? '',
    brokerNote: property?.brokerNote ?? '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [suggestions, setSuggestions] = useState({
    cities: [],
    citiesEn: [],
    neighborhoods: [],
    neighborhoodsEn: [],
  });

  useEffect(() => {
    fetch('/api/admin/properties-suggestions')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && !data.error) {
          setSuggestions({
            cities: data.cities || [],
            citiesEn: data.citiesEn || [],
            neighborhoods: data.neighborhoods || [],
            neighborhoodsEn: data.neighborhoodsEn || [],
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const transliterateBgToLatin = (str) => {
    const map = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z',
      и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
      р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
      ш: 'sh', щ: 'sht', ъ: 'a', ь: '', ю: 'yu', я: 'ya',
    };
    return str
      .toLowerCase()
      .split('')
      .map((char) => map[char] ?? char)
      .join('');
  };

  const generateSlug = () => {
    const title = formData.title?.trim() || '';
    if (!title) return;
    const latin = transliterateBgToLatin(title);
    const slug = latin
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
    setFormData(prev => ({ ...prev, slug: slug || 'imot' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    console.log('[PropertyForm] handleSubmit called');
    console.log('[PropertyForm] Current formData.images:', formData.images);

    // Prepare data
    const propertyData = {
      ...formData,
      currency: 'EUR',
      price: Number(formData.price) || 0,
      area: Number(formData.area) || 0,
      rooms: formData.rooms ? Number(formData.rooms) : null,
      floor: formData.floor ? Number(formData.floor) : null,
      totalFloors: formData.totalFloors ? Number(formData.totalFloors) : null,
      yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : null,
      yearBuiltStatus: formData.yearBuiltStatus || null,
      brokerNote: formData.brokerNote || null,
      features: formData.features
        .split(',')
        .map(f => f.trim())
        .filter(Boolean),
      featuresEn: formData.featuresEn
        .split(',')
        .map(f => f.trim())
        .filter(Boolean),
      images: formData.images,
    };

    console.log('[PropertyForm] Prepared propertyData:', propertyData);
    console.log('[PropertyForm] propertyData.images:', propertyData.images);

    try {
      let result;

      if (isEditing) {
        console.log('[PropertyForm] Calling updateProperty with id:', property.id);
        result = await updateProperty(property.id, propertyData);
      } else {
        console.log('[PropertyForm] Calling createProperty');
        result = await createProperty(propertyData);
      }

      console.log('[PropertyForm] API result:', result);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(isEditing ? 'Имотът е обновен успешно!' : 'Имотът е създаден успешно!');
        if (!isEditing) {
          setTimeout(() => {
            router.push('/admin/properties');
          }, 1500);
        }
      }
    } catch (err) {
      setError('Възникна неочаквана грешка. Моля, опитайте отново.');
      console.error('[PropertyForm] Exception:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDemo) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">Демо режим</h2>
        <p className="text-yellow-700">
          За да добавяте и редактирате имоти, конфигурирайте Supabase връзката:
        </p>
        <ol className="mt-4 text-yellow-700 list-decimal list-inside space-y-2">
          <li>Създайте проект в <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">Supabase</a></li>
          <li>Изпълнете SQL схемата от <code className="bg-yellow-100 px-1 rounded">supabase/schema.sql</code></li>
          <li>Добавете <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> и <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> в <code className="bg-yellow-100 px-1 rounded">.env.local</code></li>
          <li>Рестартирайте приложението</li>
        </ol>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg text-gray-900 mb-4">Основна информация</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm text-gray-700 mb-1">
                Заглавие * (БГ)
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Тристаен апартамент в Лозенец"
              />
            </div>
            <div>
              <label htmlFor="titleEn" className="block text-sm text-gray-700 mb-1">
                Заглавие (EN)
              </label>
              <input
                type="text"
                id="titleEn"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Three-room apartment in Lozenets"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="slug" className="flex items-center gap-1.5 text-sm text-gray-700 mb-1">
                Slug (URL) *
                <span className="relative group inline-flex shrink-0">
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-gray-600 text-xs font-bold cursor-help hover:bg-gray-400"
                    aria-label="Какво е slug?"
                  >
                    i
                  </span>
                  <span className="absolute left-0 top-full mt-1.5 px-3 py-2 w-72 text-left text-xs font-normal bg-gray-800 text-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                    Slug е краткото име на страницата в адреса. Показва се горе в клиента (в адресната лента), когато някой отвори този апартамент — напр. …/properties/<strong className="text-white">tristaen-apartament-lozenets</strong>. Само латински букви, цифри и тирета.
                  </span>
                </span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="tristaen-apartament-lozenets"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Генерирай
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm text-gray-700 mb-1">
                Категория *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {propertyCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm text-gray-700 mb-1">
                Тип имот *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm text-gray-700 mb-1">
                Статус *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {propertyStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Price & Area */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg text-gray-900 mb-4">Цена и площ</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm text-gray-700 mb-1">
              Цена *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="185000"
            />
            <p className="mt-1 text-xs text-gray-500">Цената се въвежда в евро (EUR).</p>
          </div>

          <div>
            <label htmlFor="area" className="block text-sm text-gray-700 mb-1">
              Площ (m²) *
            </label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="95"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="priceIncludesVat"
              checked={formData.priceIncludesVat}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Цена с включено ДДС</span>
          </label>
          <p className="mt-1 text-xs text-gray-500">Ако не е тикнато, цената се счита за без включено ДДС.</p>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg text-gray-900 mb-4">Детайли</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="rooms" className="block text-sm text-gray-700 mb-1">
              Стаи
            </label>
            <input
              type="number"
              id="rooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="3"
            />
          </div>

          <div>
            <label htmlFor="floor" className="block text-sm text-gray-700 mb-1">
              Етаж
            </label>
            <select
              id="floor"
              name="floor"
              value={formData.floor === '' || formData.floor == null ? '' : String(formData.floor)}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">—</option>
              <option value="0">Партер</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((n) => (
                <option key={n} value={n}>{n}. етаж</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="totalFloors" className="block text-sm text-gray-700 mb-1">
              Общо етажи
            </label>
            <input
              type="number"
              id="totalFloors"
              name="totalFloors"
              value={formData.totalFloors}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="8"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-2">
              Година на строителство
            </label>
            <div className="space-y-2">
              {yearBuiltStatuses.map((opt) => (
                <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="yearBuiltStatus"
                    value={opt.value}
                    checked={(formData.yearBuiltStatus || '') === opt.value}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
            {(formData.yearBuiltStatus === 'completed' || formData.yearBuiltStatus === 'under_construction') && (
              <div className="mt-3">
                <label htmlFor="yearBuilt" className="block text-sm text-gray-700 mb-1">
                  {formData.yearBuiltStatus === 'completed' ? 'Година на въвеждане в експлоатация' : 'Очаквана година на въвеждане'}
                </label>
                <input
                  type="number"
                  id="yearBuilt"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  min="1900"
                  max="2035"
                  className="w-full max-w-[140px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={formData.yearBuiltStatus === 'under_construction' ? '2026' : '2020'}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="constructionType" className="block text-sm text-gray-700 mb-1">
              Тип строителство
            </label>
            <select
              id="constructionType"
              name="constructionType"
              value={formData.constructionType ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">—</option>
              {constructionTypes.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="gaz"
                checked={formData.gaz}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Газ</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="tec"
                checked={formData.tec}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">ТЕЦ</span>
            </label>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg text-gray-900 mb-4">Локация</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm text-gray-700 mb-1">
                Град * (БГ)
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                list="city-bg-suggestions"
                autoComplete="off"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="София"
              />
              <datalist id="city-bg-suggestions">
                {suggestions.cities.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="cityEn" className="block text-sm text-gray-700 mb-1">
                Град (EN)
              </label>
              <input
                type="text"
                id="cityEn"
                name="cityEn"
                value={formData.cityEn}
                onChange={handleChange}
                list="city-en-suggestions"
                autoComplete="off"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Sofia"
              />
              <datalist id="city-en-suggestions">
                {suggestions.citiesEn.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="neighborhood" className="block text-sm text-gray-700 mb-1">
                Квартал (БГ)
              </label>
              <input
                type="text"
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                list="neighborhood-bg-suggestions"
                autoComplete="off"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Лозенец"
              />
              <datalist id="neighborhood-bg-suggestions">
                {suggestions.neighborhoods.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="neighborhoodEn" className="block text-sm text-gray-700 mb-1">
                Квартал (EN)
              </label>
              <input
                type="text"
                id="neighborhoodEn"
                name="neighborhoodEn"
                value={formData.neighborhoodEn}
                onChange={handleChange}
                list="neighborhood-en-suggestions"
                autoComplete="off"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Lozenets"
              />
              <datalist id="neighborhood-en-suggestions">
                {suggestions.neighborhoodsEn.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address" className="block text-sm text-gray-700 mb-1">
                Адрес * (БГ)
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ул. Златен рог 15, Лозенец, София"
              />
            </div>
            <div>
              <label htmlFor="addressEn" className="block text-sm text-gray-700 mb-1">
                Адрес (EN)
              </label>
              <input
                type="text"
                id="addressEn"
                name="addressEn"
                value={formData.addressEn}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="15 Zlaten Rog St, Lozenets, Sofia"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mapUrl" className="block text-sm text-gray-700 mb-1">
              Google Maps URL
            </label>
            <input
              type="url"
              id="mapUrl"
              name="mapUrl"
              value={formData.mapUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.google.com/maps/..."
            />
          </div>

          <div>
            <label htmlFor="videoUrl" className="block text-sm text-gray-700 mb-1">
              Видео (YouTube) – линк
            </label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="mt-1 text-xs text-gray-500">Линкът се показва при клиента на страницата на обекта.</p>
          </div>
        </div>
      </div>

      {/* Description & Features */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg text-gray-900 mb-4">Описание</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="description" className="block text-sm text-gray-700 mb-1">
                Описание (БГ)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Подробно описание на имота..."
              />
            </div>
            <div>
              <label htmlFor="descriptionEn" className="block text-sm text-gray-700 mb-1">
                Описание (EN)
              </label>
              <textarea
                id="descriptionEn"
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detailed property description..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="features" className="flex items-center gap-1.5 text-sm text-gray-700 mb-1">
                Удобства (БГ, разделени със запетая)
                <span className="relative group inline-flex shrink-0">
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-gray-600 text-xs font-bold cursor-help hover:bg-gray-400"
                    aria-label="Предложени удобства"
                  >
                    i
                  </span>
                  <span className="absolute left-0 top-full mt-1.5 px-3 py-2 w-80 text-left text-xs font-normal bg-gray-800 text-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none whitespace-pre-line">
                    {['С преход', 'Асансьор', 'С гараж', 'С паркинг', 'Интернет връзка', 'С действащ бизнес', 'Обзаведен', 'Видео наблюдение', 'Контрол на достъпа', 'Охрана', 'Саниран', 'В затворен комплекс', 'За ремонт', 'Възможност за дан. кредит'].join('\n')}
                  </span>
                </span>
              </label>
              <input
                type="text"
                id="features"
                name="features"
                value={formData.features}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Паркомясто, Асансьор, Климатик"
              />
            </div>
            <div>
              <label htmlFor="featuresEn" className="flex items-center gap-1.5 text-sm text-gray-700 mb-1">
                Удобства (EN, разделени със запетая)
                <span className="relative group inline-flex shrink-0">
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-gray-600 text-xs font-bold cursor-help hover:bg-gray-400"
                    aria-label="Suggested amenities"
                  >
                    i
                  </span>
                  <span className="absolute left-0 top-full mt-1.5 px-3 py-2 w-80 text-left text-xs font-normal bg-gray-800 text-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none whitespace-pre-line">
                    {['With hallway', 'Elevator', 'With garage', 'With parking', 'Internet connection', 'With operating business', 'Furnished', 'CCTV', 'Access control', 'Security', 'Renovated', 'In gated complex', 'For renovation', 'Mortgage possible'].join('\n')}
                  </span>
                </span>
              </label>
              <input
                type="text"
                id="featuresEn"
                name="featuresEn"
                value={formData.featuresEn}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Parking, Elevator, AC"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Снимки
            </label>
            <ImageUpload
              images={formData.images}
              onChange={(newImages) => {
                console.log('[PropertyForm] ImageUpload onChange called with:', newImages);
                setFormData(prev => {
                  const updated = { ...prev, images: newImages };
                  console.log('[PropertyForm] Updated formData.images:', updated.images);
                  return updated;
                });
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
              Промотиран имот (показва се на началната страница)
            </label>
          </div>
        </div>
      </div>

      {/* Лична бележка на брокера – само за админ */}
      <div className="bg-amber-50/80 p-6 rounded-lg shadow-sm border border-amber-200">
        <h3 className="text-lg font-semibold text-amber-900 mb-1">Лична бележка на брокера</h3>
        <p className="text-sm text-amber-800 mb-3">Само ти я виждаш от админ панела – не се показва на клиентите.</p>
        <textarea
          id="brokerNote"
          name="brokerNote"
          value={formData.brokerNote}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          placeholder="Тук пиши коментари за обекта само за себе си – напр. дати на огледи, договорености с клиента, вътрешни бележки..."
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/properties')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Отказ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Запазване...' : isEditing ? 'Обнови имот' : 'Създай имот'}
        </button>
      </div>
    </form>
  );
}
