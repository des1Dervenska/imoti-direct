'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPriceEurAndBgn } from '@/lib/constants';
import { getTypeLabel, getCategoryLabel, getConstructionTypeLabel } from '@/data/properties';

const statusLabels = {
  active: { label: 'Активна', className: 'bg-green-100 text-green-800' },
  pending: { label: 'Чакаща', className: 'bg-yellow-100 text-yellow-800' },
  sold: { label: 'Продадена', className: 'bg-blue-100 text-blue-800' },
  rented: { label: 'Отдадена', className: 'bg-blue-100 text-blue-800' },
  inactive: { label: 'Неактивна', className: 'bg-gray-100 text-gray-800' },
};

const CONFIRM_DELETE_MESSAGE = 'Сигурни ли сте, че искате да изтриете този имот? Това действие не може да бъде отменено.';

export default function PropertyTable({ properties, isDemo = false }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  async function handleDelete(property) {
    if (!window.confirm(CONFIRM_DELETE_MESSAGE)) return;
    setDeleteError(null);
    setDeletingId(property.id);
    try {
      const res = await fetch(`/api/admin/properties/${property.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data.error || 'Грешка при изтриване');
        return;
      }
      router.refresh();
    } catch (err) {
      setDeleteError('Грешка при изтриване на имота');
    } finally {
      setDeletingId(null);
    }
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Няма намерени имоти</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {isDemo && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Демо режим:</strong> Показват се примерни данни. За да добавяте и редактирате имоти,
            конфигурирайте Supabase в <code className="bg-yellow-100 px-1 rounded">.env.local</code>
          </p>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Имот
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Тип
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Категория
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Цена
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Град
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Тип строит.
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Газ / ТЕЦ
            </th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => {
            const status = statusLabels[property.status] || statusLabels.inactive;

            return (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm text-gray-900">
                        {property.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.area} m² {property.rooms ? `• ${property.rooms} стаи` : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getTypeLabel(property.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCategoryLabel(property.category)}
                </td>
                <td className="px-6 py-4 text-sm">
                  {(() => {
                    const { eurText, bgnText } = formatPriceEurAndBgn(property.price, property.category);
                    const vatLabel = property.priceIncludesVat ? 'с ДДС' : 'без ДДС';
                    return (
                      <span>
                        <span className="text-gray-900">{eurText}</span>
                        <span className="block text-xs text-gray-500">{bgnText}</span>
                        <span className="block text-xs text-gray-500">{vatLabel}</span>
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {property.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getConstructionTypeLabel(property.constructionType) || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {[property.gaz && 'Газ', property.tec && 'ТЕЦ'].filter(Boolean).join(' / ') || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link
                    href={`/properties/${property.slug}`}
                    className="text-gray-600 hover:text-gray-900 mr-4"
                    target="_blank"
                  >
                    Преглед
                  </Link>
                  {!isDemo && (
                    <>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Редактирай
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(property)}
                        disabled={deletingId === property.id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === property.id ? 'Изтриване…' : 'Изтрий'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
