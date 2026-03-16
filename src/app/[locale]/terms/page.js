import { BRAND_NAME, CONTACT_EMAIL, CONTACT_PERSON } from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import { Section, Container, AnimateOnScroll } from '@/components/ui';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: `${t.terms.title} | ${BRAND_NAME}`,
    description:
      locale === 'en'
        ? `Terms of use of the ${BRAND_NAME} website – real estate for sale and rent.`
        : `Общи условия за ползване на уебсайта на ${BRAND_NAME} – недвижими имоти за продажба и наем.`,
  };
}

export default async function TermsPage({ params }) {
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
              {t.terms.title}
            </h1>
            <p className="text-graphite-light mb-8">
              {t.terms.lastUpdated} <span className="font-sans-nums">{lastUpdated}</span>
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up">
            <div className="prose prose-graphite max-w-none space-y-8 text-graphite-light">
              <section>
                <h2 className="text-xl font-semibold text-graphite mb-3">{t.terms.section1Title}</h2>
                <p>
                  {isEn
                    ? `These terms govern the use of the ${BRAND_NAME} website. By accessing and using the site you accept them. The site provides information on real estate for sale and rent in Bulgaria and connects clients with ${BRAND_NAME}, represented by ${CONTACT_PERSON}.`
                    : `Настоящите условия уреждат ползването на уебсайта на ${BRAND_NAME}. С достъп и използване на Сайта вие приемате тези условия. Сайтът предлага информация за недвижими имоти за продажба и наем в България и служи за свързване на клиенти с ${BRAND_NAME}, представена от ${CONTACT_PERSON}.`}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-graphite mb-3">{t.terms.section2Title}</h2>
                <p>
                  {isEn
                    ? 'All listings, descriptions, photos and prices on the site are for information only. We strive to keep information accurate but do not guarantee completeness. Prices are in EUR; BGN equivalent is indicative.'
                    : 'Всички обяви, описания, снимки и цени на Сайта са с информативен характер. Ние полагаме усилия да поддържаме информацията актуална и точна. Цените са в евро (EUR), като еквивалент в лева (BGN) е ориентировъчен.'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-graphite mb-3">{t.terms.section3Title}</h2>
                <p>
                  {isEn
                    ? 'You may browse the content, contact us via the form or by phone. Unauthorized copying, distribution, use of content, or misuse of the site is prohibited.'
                    : 'Позволено е да разглеждате съдържанието и да ни пишете чрез формата за контакт. Забранено е незаконно копиране, разпространение или използване на съдържанието без писмено съгласие.'}
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
