'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPriceEur } from '@/lib/constants';
import { getTypeLabel, getCategoryLabel } from '@/data/properties';

const statusLabels = {
  active: { label: 'Активна', className: 'bg-green-100 text-green-800' },
  pending: { label: 'Чакаща', className: 'bg-yellow-100 text-yellow-800' },
  sold: { label: 'Продадена', className: 'bg-blue-100 text-blue-800' },
  rented: { label: 'Отдадена', className: 'bg-blue-100 text-blue-800' },
  inactive: { label: 'Блокирана', className: 'bg-gray-100 text-gray-800' },
};

const CONFIRM_DELETE_MESSAGE = 'Сигурни ли сте, че искате да изтриете този имот? Това действие не може да бъде отменено.';

/** Извън компонента – стабилна при Fast Refresh (избягва „handleClone is not defined“). */
async function runCloneListing(property, { setCloneError, setCloningId, router }) {
  const id = property.id;
  if (id == null || id === '') {
    setCloneError('Липсва id на имот');
    return;
  }
  setCloneError(null);
  setCloningId(id);
  try {
    const res = await fetch(`/api/admin/properties/${String(id)}/clone`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setCloneError(data.error || 'Грешка при клониране');
      return;
    }
    if (data.property?.id != null) {
      router.push(`/admin/properties/${data.property.id}/edit`);
      router.refresh();
    }
  } catch {
    setCloneError('Грешка при клониране на имота');
  } finally {
    setCloningId(null);
  }
}

export default function PropertyTable({ properties, isDemo = false }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [cloningId, setCloningId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [cloneError, setCloneError] = useState(null);

  async function handleDelete(property) {
    if (!window.confirm(CONFIRM_DELETE_MESSAGE)) return;
    const id = property.id;
    if (id == null || id === '') {
      setDeleteError('Липсва id на имот');
      return;
    }
    setDeleteError(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/properties/${String(id)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data.error || 'Грешка при изтриване');
        return;
      }
      window.location.href = '/admin/properties';
    } catch (err) {
      setDeleteError('Грешка при изтриване на имота');
    } finally {
      setDeletingId(null);
    }
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50/50 py-14 text-center">
        <p className="text-sm font-medium text-gray-600">Няма намерени имоти</p>
        <p className="mt-1 text-xs text-gray-500">Променете търсенето или филтрите.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200/80 bg-white shadow-sm">
      {deleteError && (
        <div className="m-4 rounded-xl border border-red-200/80 bg-red-50/90 p-4">
          <p className="text-red-800 text-sm">{deleteError}</p>
        </div>
      )}
      {cloneError && (
        <div className="m-4 rounded-xl border border-red-200/80 bg-red-50/90 p-4">
          <p className="text-red-800 text-sm">{cloneError}</p>
        </div>
      )}
      {isDemo && (
        <div className="m-4 rounded-xl border border-amber-200/80 bg-amber-50/90 p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Демо режим:</strong> Показват се примерни данни. За да добавяте и редактирате имоти,
            конфигурирайте Supabase в <code className="bg-yellow-100 px-1 rounded">.env.local</code>
          </p>
        </div>
      )}

      <table className="w-full divide-y divide-gray-100">
        <thead className="bg-slate-50/95">
          <tr>
            <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 whitespace-nowrap">
              Код
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 min-w-[280px]">
              Имот
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 whitespace-nowrap">
              Категория
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Цена
            </th>
            <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 whitespace-nowrap w-[110px]">
              Град
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 whitespace-nowrap">
              Статус
            </th>
            <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 whitespace-nowrap w-[110px]">
              Тип
            </th>
            <th className="px-3 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-600 whitespace-nowrap min-w-[230px]">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {properties.map((property) => {
            const status = statusLabels[property.status] || statusLabels.inactive;

            return (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                  {property.code ? String(property.code) : '—'}
                </td>
                <td className="px-4 py-4 min-w-[280px]">
                  <div className="flex items-center min-w-0">
                    <div className="min-w-0">
                      <div className="text-sm text-gray-900 truncate max-w-[360px]" title={property.title}>
                        {property.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.area} m² {property.rooms ? `• ${property.rooms} стаи` : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCategoryLabel(property.category)}
                </td>
                <td className="px-4 py-4 text-sm whitespace-nowrap">
                  {(() => {
                    const { eurText } = formatPriceEur(property.price, property.category);
                    const vatLabel = property.priceIncludesVat ? 'с ДДС' : 'без ДДС';
                    return (
                      <span>
                        <span className="text-gray-900">{eurText}</span>
                        <span className="block text-xs text-gray-500">{vatLabel}</span>
                      </span>
                    );
                  })()}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[110px] truncate" title={property.city}>
                  {property.city || '—'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[110px] truncate" title={getTypeLabel(property.type)}>
                  {getTypeLabel(property.type)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                  <Link
                    href={`/properties/${property.slug}`}
                    className="mr-4 text-gray-500 hover:text-gray-900 transition-colors"
                    target="_blank"
                  >
                    Преглед
                  </Link>
                  {!isDemo && (
                    <>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="mr-4 font-medium text-cadetblue-dark hover:text-cadetblue transition-colors"
                      >
                        Редактирай
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          void runCloneListing(property, {
                            setCloneError,
                            setCloningId,
                            router,
                          })
                        }
                        disabled={cloningId === property.id}
                        className="text-emerald-700 hover:text-emerald-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cloningId === property.id ? 'Копиране…' : 'Копирай'}
                      </button>
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
