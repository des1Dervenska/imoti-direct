'use client';

import { useEffect } from 'react';

/** Задава document.title за коректно име при „Запази като PDF“. */
export default function PrintDocumentTitle({ title }) {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);

  return null;
}
