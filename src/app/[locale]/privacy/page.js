import { BRAND_NAME, CONTACT_EMAIL, CONTACT_PERSON } from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import { Section, Container, AnimateOnScroll } from '@/components/ui';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: `${t.privacy.title} | ${BRAND_NAME}`,
    description:
      locale === 'en'
        ? `Privacy policy and personal data protection when using ${BRAND_NAME} website.`
        : `Политика за поверителност и защита на личните данни при използване на сайта на ${BRAND_NAME}.`,
  };
}

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isEn = locale === 'en';
  const dateLocale = isEn ? 'en-GB' : 'bg-BG';
  const lastUpdated = new Date().toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <AnimateOnScroll direction="down">
            <h1 className="text-3xl md:text-4xl font-bold text-cadetblue mb-2 tracking-wide [text-shadow:0_1px_2px_rgba(0,151,178,0.25)]">
              {t.privacy.title}
            </h1>
            <p className="text-graphite-light mb-8">
              {t.privacy.lastUpdated} <span>{lastUpdated}</span>
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up">
            <div className="prose prose-graphite max-w-none space-y-8 text-graphite-light">
              <section>
                <h2 className="text-xl font-semibold text-graphite mb-3">{t.privacy.section1Title}</h2>
                <p>
                  {isEn
                    ? `The data controller for personal data collected through this website is ${BRAND_NAME}, represented by ${CONTACT_PERSON}. For questions about your data, contact us at ${CONTACT_EMAIL}.`
                    : `Администратор на личните данни, събирани чрез този уебсайт, е ${BRAND_NAME}, представена от ${CONTACT_PERSON}. За въпроси относно личните ви данни можете да се свържете с нас на ${CONTACT_EMAIL}.`}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-graphite mb-3">{t.privacy.section2Title}</h2>
                <p className="mb-2">
                  {isEn
                    ? 'In our real estate brokerage we may collect and process: contact data (name, phone, email when you submit an inquiry), website usage data (cookies, IP, browser), and data when you show interest in a property.'
                    : 'В рамките на дейността си по посредничество при продажба и наем на недвижими имоти ние можем да събираме и обработваме: данни при контакт (име, телефон, имейл), данни при разглеждане на сайта (бисквитки, IP, браузър), данни при интерес към имот.'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-graphite mb-3">{t.privacy.section3Title}</h2>
                <p>
                  {isEn
                    ? 'Personal data are used to respond to inquiries, arrange viewings, prepare offers and contracts, and to improve the website. We do not sell your data to third parties for marketing.'
                    : 'Личните данни се използват за отговори на запитвания, организиране на огледи, изготвяне на оферти и договори, както и за подобряване на уебсайта. Ние не продаваме вашите данни на трети страни за маркетинг цели.'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-graphite mb-3">
                  {isEn ? '4. Contact' : '4. Контакт'}
                </h2>
                <p>
                  {CONTACT_EMAIL}
                </p>
              </section>
            </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  );
}
