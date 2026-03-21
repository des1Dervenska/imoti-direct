import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ConsentModeBootstrap from '@/components/consent/ConsentModeBootstrap';
import GoogleAnalytics from '@/components/consent/GoogleAnalytics';
import GoogleTagManager from '@/components/consent/GoogleTagManager';
import CookieBanner from '@/components/consent/CookieBanner';
import { isValidLocale } from '@/lib/i18n';

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <>
      <Navbar locale={locale} />
      <main className="pt-28 md:pt-32 min-h-screen">
        {children}
      </main>
      <Footer locale={locale} />
      <ConsentModeBootstrap />
      <GoogleAnalytics />
      <GoogleTagManager />
      <CookieBanner locale={locale} />
    </>
  );
}
