'use client';

import Link from 'next/link';
import { formatPriceEurAndBgn } from '@/lib/constants';
import { getTypeLabel, getCategoryLabel } from '@/data/properties';

const statusLabels = {
  active: { label: 'Активна', className: 'bg-green-100 text-green-800' },
  pending: { label: 'Чакаща', className: 'bg-yellow-100 text-yellow-800' },
  sold: { label: 'Продадена', className: 'bg-blue-100 text-blue-800' },
  rented: { label: 'Отдадена', className: 'bg-blue-100 text-blue-800' },
  inactive: { label: 'Неактивна', className: 'bg-gray-100 text-gray-800' },
};

export default function PropertyTable({ properties, isDemo = false }) {
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Имот
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Тип
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Категория
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Цена
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Град
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <div className="text-sm font-medium text-gray-900">
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
                    return (
                      <span>
                        <span className="font-medium text-gray-900">{eurText}</span>
                        <span className="block text-xs text-gray-500">{bgnText}</span>
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {property.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/properties/${property.slug}`}
                    className="text-gray-600 hover:text-gray-900 mr-4"
                    target="_blank"
                  >
                    Преглед
                  </Link>
                  {!isDemo && (
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Редактирай
                    </Link>
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
