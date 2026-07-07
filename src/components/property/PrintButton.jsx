'use client';

export default function PrintButton({ label = 'Печат / Запази като PDF' }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm"
    >
      {label}
    </button>
  );
}
