import { BRAND_NAME, CONTACT_EMAIL, CONTACT_PERSON } from '@/lib/constants';
import { Section, Container, AnimateOnScroll } from '@/components/ui';

export const metadata = {
  title: `Политика за поверителност | ${BRAND_NAME}`,
  description: `Политика за поверителност и защита на личните данни при използване на сайта на ${BRAND_NAME}.`,
};

export default function PrivacyPage() {
  return (
    <>
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <AnimateOnScroll direction="down">
          <h1 className="text-3xl md:text-4xl font-bold text-cadetblue mb-2 tracking-wide [text-shadow:0_1px_2px_rgba(95,158,160,0.25)]">
            Политика за поверителност
          </h1>
          <p className="text-graphite-light mb-8">
            Последна актуализация: {new Date().toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up">
          <div className="prose prose-graphite max-w-none space-y-8 text-graphite-light">
            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">1. Администратор на данните</h2>
              <p>
                Администратор на личните данни, събирани чрез този уебсайт, е {BRAND_NAME}, представена от {CONTACT_PERSON}.
                За въпроси относно личните ви данни можете да се свържете с нас на {CONTACT_EMAIL}.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">2. Какви данни събираме</h2>
              <p className="mb-2">
                В рамките на дейността си по посредничество при продажба и наем на недвижими имоти ние можем да събираме и обработваме:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Данни при контакт:</strong> име, телефон, имейл адрес, когато изпратите запитване чрез формата за контакт или ни се обадите.</li>
                <li><strong>Данни при разглеждане на сайта:</strong> информация от бисквитки (cookies), IP адрес, тип браузър и устройство, за да подобрим работата на сайта (аналитика и сигурност).</li>
                <li><strong>Данни при интерес към имот:</strong> съобщения и контактни данни, които предоставяте при запитване за конкретен имот.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">3. Цели на обработката</h2>
              <p>
                Личните данни се използват за отговори на запитвания, организиране на огледи, изготвяне на оферти и договори, както и за подобряване на уебсайта и комуникацията с вас. Ние не продаваме вашите данни на трети страни за маркетинг цели.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">4. Срок на съхранение</h2>
              <p>
                Съхраняваме данните ви докато е необходимо за изпълнение на договорни или законови задължения, или докато има законен интерес. След изтичане на срока данните се изтриват или анонимизират.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">5. Вашите права</h2>
              <p className="mb-2">
                Съгласно приложимото българско и европейско законодателство (ЗЗЛД и Регламент (ЕС) 2016/679) имате право на:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>достъп до вашите лични данни;</li>
                <li>поправка на неточни данни;</li>
                <li>изтриване на данни („право на забвение“), когато няма законово основание за по-нататъшна обработка;</li>
                <li>ограничаване на обработката и възражение срещу обработка при определени условия;</li>
                <li>право на преносимост на данните, когато е приложимо.</li>
              </ul>
              <p className="mt-3">
                За упражняване на правата си пишете ни на {CONTACT_EMAIL}. Имате право да подадете жалба до Комисията за защита на личните данни (КЗЛД).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">6. Бисквитки (cookies)</h2>
              <p>
                Сайтът може да използва бисквитки за подобряване на потребителското изживяване и за аналитика. Можете да настроите браузъра си да отказва бисквитки; в такъв случай някои функции на сайта може да не работят напълно.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">7. Промени</h2>
              <p>
                Тази политика може да бъде актуализирана. Промените влизат в сила от датата на публикуване на тази страница. Препоръчваме периодично да преглеждате текста.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-graphite mb-3">8. Контакт</h2>
              <p>
                За въпроси относно политиката за поверителност и личните данни: {CONTACT_EMAIL}.
              </p>
            </section>
          </div>
          </AnimateOnScroll>
        </Container>
      </Section>
    </>
  );
}
