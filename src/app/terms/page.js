import { BRAND_NAME, CONTACT_EMAIL, CONTACT_PERSON } from '@/lib/constants';
import { Section, Container, AnimateOnScroll } from '@/components/ui';

export const metadata = {
  title: `Условия за ползване | ${BRAND_NAME}`,
  description: `Общи условия за ползване на уебсайта на ${BRAND_NAME} – недвижими имоти за продажба и наем.`,
};

export default function TermsPage() {
  return (
    <>
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <AnimateOnScroll direction="down">
          <h1 className="text-3xl md:text-4xl font-bold text-cadetblue mb-2 tracking-wide [text-shadow:0_1px_2px_rgba(95,158,160,0.25)]">
            Условия за ползване
          </h1>
          <p className="text-graphite-light mb-8">
            Последна актуализация: {new Date().toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up">
          <div className="prose prose-graphite max-w-none space-y-8 text-graphite-light">
            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">1. Общи положения</h2>
              <p>
                Настоящите условия уреждат ползването на уебсайта на {BRAND_NAME} („Сайтът“). С достъп и използване на Сайта вие приемате тези условия. Сайтът предлага информация за недвижими имоти за продажба и наем в България и служи за свързване на клиенти с {BRAND_NAME}, представена от {CONTACT_PERSON}.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">2. Информация за имотите</h2>
              <p>
                Всички обяви, описания, снимки и цени на Сайта са с информативен характер. Ние полагаме усилия да поддържаме информацията актуална и точна, но не гарантираме пълнотата или липсата на грешки. Актуалността на офертите и наличността на имотите се потвърждават при контакт с нас. Цените са в евро (EUR), като еквивалент в лева (BGN) е ориентировъчен.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">3. Ползване на Сайта</h2>
              <p className="mb-2">
                Позволено е да разглеждате съдържанието, да ни пишете чрез формата за контакт и да се обаждате по посочените телефони. Забранено е:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>незаконно копиране, разпространение или използване на съдържанието на Сайта без писмено съгласие;</li>
                <li>внасяне на вредоносен софтуер или злоупотреба с техническите средства на Сайта;</li>
                <li>използване на сайта за неразрешена търговска или рекламна дейност.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">4. Сделки и договори</h2>
              <p>
                Никой от посочените имоти не представлява оферта в правния смисъл до сключване на предварителен или окончателен договор. Всички сделки се уреждат чрез личен контакт, огледи и подписване на документи съгласно действащото българско законодателство. Условията на конкретната сделка се определят в съответния договор.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">5. Интелектуална собственост</h2>
              <p>
                Всички текстове, лога, изображения, дизайн и други материали на Сайта са собственост на {BRAND_NAME} или са използвани с право. Ползването на Сайта не ви дава право върху тях. Копирането и разпространението без писмено разрешение е забранено.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">6. Ограничение на отговорността</h2>
              <p>
                {BRAND_NAME} не носи отговорност за косвени, следствени или пропуснати ползи от ползване на Сайта или от невъзможност за ползване. Сайтът се предоставя „какъвто е“. Ние не гарантираме непрекъсната или безгрешна работа на сайта. Връзките към външни сайтове (например карти, социални мрежи) са извън нашия контрол и за тях важат техните собствени условия.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">7. Приложимо право и спорове</h2>
              <p>
                Към тези условия се прилага законодателството на Република България. Спорове по тях се отнасят до компетентните български съдилища.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">8. Промени в условията</h2>
              <p>
                {BRAND_NAME} си запазва правото да променя настоящите условия. Актуализациите влизат в сила от момента на публикуване на тази страница. Продължаващото ползване на Сайта след промените означава приемане на новите условия.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">9. Контакт</h2>
              <p>
                За въпроси относно условията за ползване: {CONTACT_EMAIL}.
              </p>
            </section>
          </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  );
}
