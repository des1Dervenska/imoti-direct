'use client';

import { useEffect } from 'react';
import PrintButton from '@/components/property/PrintButton';

export default function PrintPageShell({ children, backHref, backLabel, printLabel }) {
  useEffect(() => {
    document.body.classList.add('property-print-page');
    return () => document.body.classList.remove('property-print-page');
  }, []);

  return (
    <>
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <PrintButton label={printLabel} />
        {backHref && (
          <a
            href={backHref}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm text-gray-800"
          >
            {backLabel}
          </a>
        )}
      </div>
      {children}
    </>
  );
}
