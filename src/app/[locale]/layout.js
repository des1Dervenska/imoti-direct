import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { isValidLocale } from '@/lib/i18n';

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <>
      <Navbar locale={locale} />
      <main className="pt-16 min-h-screen">
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
}
