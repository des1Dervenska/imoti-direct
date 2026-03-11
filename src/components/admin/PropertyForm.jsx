'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  propertyTypes,
  propertyCategories,
  propertyStatuses,
  cities,
  PROPERTY_STATUS,
  CURRENCY,
} from '@/data/properties';
import { createProperty, updateProperty } from '@/lib/properties';

export default function PropertyForm({ property = null, isDemo = false }) {
  const router = useRouter();
  const isEditing = Boolean(property);

  const [formData, setFormData] = useState({
    title: property?.title || '',
    slug: property?.slug || '',
    category: property?.category || 'sale',
    type: property?.type || 'apartment',
    status: property?.status || PROPERTY_STATUS.ACTIVE,
    price: property?.price || '',
    currency: property?.currency || CURRENCY.EUR,
    area: property?.area || '',
    rooms: property?.rooms || '',
    floor: property?.floor || '',
    totalFloors: property?.totalFloors || '',
    yearBuilt: property?.yearBuilt || '',
    city: property?.city || '',
    neighborhood: property?.neighborhood || '',
    address: property?.address || '',
    description: property?.description || '',
    features: property?.features?.join(', ') || '',
    images: property?.images?.join('\n') || '',
    mapUrl: property?.mapUrl || '',
    isFeatured: property?.isFeatured || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // Prepare data
    const propertyData = {
      ...formData,
      price: Number(formData.price) || 0,
      area: Number(formData.area) || 0,
      rooms: formData.rooms ? Number(formData.rooms) : null,
      floor: formData.floor ? Number(formData.floor) : null,
      totalFloors: formData.totalFloors ? Number(formData.totalFloors) : null,
      yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : null,
      features: formData.features
        .split(',')
        .map(f => f.trim())
        .filter(Boolean),
      images: formData.images
        .split('\n')
        .map(url => url.trim())
        .filter(Boolean),
    };

    try {
      let result;

      if (isEditing) {
        result = await updateProperty(property.id, propertyData);
      } else {
        result = await createProperty(propertyData);
      }

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
      console.error(err);
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Основна информация</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Заглавие *
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

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) *
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
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Цена и площ</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Валута
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="EUR">EUR</option>
              <option value="BGN">BGN</option>
            </select>
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
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
      </div>

      {/* Property Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Детайли</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
              Етаж
            </label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="4"
            />
          </div>

          <div>
            <label htmlFor="totalFloors" className="block text-sm font-medium text-gray-700 mb-1">
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

          <div>
            <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">
              Година
            </label>
            <input
              type="number"
              id="yearBuilt"
              name="yearBuilt"
              value={formData.yearBuilt}
              onChange={handleChange}
              min="1900"
              max="2030"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="2020"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Локация</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Град *
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Изберете град</option>
                {cities.map(city => (
                  <option key={city.value} value={city.value}>{city.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                Квартал
              </label>
              <input
                type="text"
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Лозенец"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Адрес *
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
            <label htmlFor="mapUrl" className="block text-sm font-medium text-gray-700 mb-1">
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
        </div>
      </div>

      {/* Description & Features */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Описание</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Описание
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
            <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
              Удобства (разделени със запетая)
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
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Снимки (URL адреси, по един на ред)
            </label>
            <textarea
              id="images"
              name="images"
              value={formData.images}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="/images/apartment-1.jpg&#10;/images/apartment-1-2.jpg"
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
