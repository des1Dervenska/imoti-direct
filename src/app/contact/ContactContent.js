'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CONTACT_ADDRESS,
  CONTACT_ADDRESS_EN,
  CONTACT_CITY,
  CONTACT_CITY_EN,
  CONTACT_PHONE,
  CONTACT_PHONE_LINK,
  CONTACT_EMAIL,
  CONTACT_ADDRESS_SHORT,
  CONTACT_ADDRESS_SHORT_EN,
  WORKING_HOURS,
  WORKING_HOURS_EN,
  GOOGLE_MAPS_SEARCH_URL,
} from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import { Section, Container, Card, Button, AnimateOnScroll } from '@/components/ui';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { FacebookIcon, ViberIcon, WhatsAppIcon } from '@/components/icons';

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: 'https://www.facebook.com/profile.php?id=61580202105400', label: 'Facebook' },
];

// Styles
const inputStyle = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-graphite text-graphite';
const labelStyle = 'block text-sm text-gray-700 mb-2';

// Helper: Contact info item
function ContactInfoItem({ icon: Icon, title, content }) {
  return (
    <div className="flex items-start space-x-4 group">
      <div className="w-14 h-14 bg-cadetblue/15 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-cadetblue/25">
        <Icon className="w-6 h-6 text-graphite" />
      </div>
      <div>
        <h3 className="text-graphite mb-1">{title}</h3>
        <p className="text-graphite-light"><span>{content}</span></p>
      </div>
    </div>
  );
}

// Helper: Social link button (зелено-синьо при hover)
function SocialLink({ icon: Icon, href, label }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 bg-cadetblue/15 rounded-lg flex items-center justify-center text-graphite transition-colors duration-300 hover:bg-cadetblue/25 hover:text-cadetblue-dark"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

function SuccessMessage({ message }) {
  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 shrink-0" />
      <span className="text-green-800">{message}</span>
    </div>
  );
}

export default function ContactContent({ locale = 'bg' }) {
  const t = getTranslations(locale).contact;
  const prefix = `/${locale}`;
  const isEn = locale === 'en';
  const contactCity = isEn ? CONTACT_CITY_EN : CONTACT_CITY;
  const qrCaption = isEn
    ? 'Scan the QR code to open our website on your phone.'
    : 'Сканирайте QR кода, за да отворите нашия сайт на телефона си.';

  // Премахваме „бл. 4“ от показвания адрес в секцията „Контакти“.
  const stripBlockNumber = (addr) => {
    if (!addr) return '';
    return isEn
      ? addr
          .replace(/,\s*bl\.\s*\d+\s*,\s*/gi, ', ')
          .replace(/,\s*bl\.\s*\d+\s*$/i, '')
      : addr
          .replace(/,\s*бл\.\s*\d+\s*,\s*/gi, ', ')
          .replace(/,\s*бл\.\s*\d+\s*$/u, '');
  };

  const contactAddress = stripBlockNumber(isEn ? CONTACT_ADDRESS_EN : CONTACT_ADDRESS);
  const contactAddressShort = stripBlockNumber(
    isEn ? CONTACT_ADDRESS_SHORT_EN : CONTACT_ADDRESS_SHORT
  );
  const workingHours = isEn ? WORKING_HOURS_EN : WORKING_HOURS;

  const contactInfoItems = [
    {
      icon: MapPinIcon,
      title: t.address,
      content: (
        <>
          {contactAddress}<br />
          {contactCity}
        </>
      ),
    },
    {
      icon: PhoneIcon,
      title: t.phone,
      content: (
        <a href={`tel:${CONTACT_PHONE_LINK}`} className="hover:text-graphite transition-colors">
          {CONTACT_PHONE}
        </a>
      ),
    },
    {
      icon: EnvelopeIcon,
      title: t.email,
      content: (
        <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-graphite transition-colors">
          {CONTACT_EMAIL}
        </a>
      ),
    },
    {
      icon: ClockIcon,
      title: t.workingHours,
      content: (
        <>
          <span className="block">{workingHours.weekdays}</span>
          <span className="block">{workingHours.saturday}</span>
          <span className="block">{workingHours.sunday}</span>
        </>
      ),
    },
  ];

  const subjectOptions = [
    { value: '', label: t.selectSubject },
    { value: 'buy', label: t.subjectBuy },
    { value: 'sell', label: t.subjectSell },
    { value: 'rent', label: t.subjectRent },
    { value: 'rent-out', label: t.subjectRentOut },
    { value: 'evaluation', label: t.subjectEvaluation },
    { value: 'consultation', label: t.subjectConsultation },
    { value: 'other', label: t.subjectOther },
  ];

  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    privacyConsent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const subject = searchParams.get('subject');
    const propertyPath = searchParams.get('propertyPath');
    if (subject || propertyPath) {
      setFormData((prev) => {
        let message = prev.message;
        if (propertyPath && typeof window !== 'undefined') {
          const path = propertyPath.startsWith('/') ? propertyPath : `/${propertyPath}`;
          const fullUrl = `${window.location.origin}${path}`;
          message = `${t.propertyInquiry} ${fullUrl}\n\n${t.propertyInquirySuffix}`;
        }
        return {
          ...prev,
          ...(subject ? { subject } : {}),
          ...(message ? { message } : {}),
        };
      });
    }
  }, [searchParams, locale]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.privacyConsent) return;
    setSubmitError(null);
    setIsSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          subject: formData.subject || '',
          message: formData.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data.error || (locale === 'en' ? 'Failed to send. Try again.' : 'Неуспешно изпращане. Опитайте отново.'));
        return;
      }
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        privacyConsent: false,
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      setSubmitError(locale === 'en' ? 'Network error. Try again.' : 'Грешка при изпращане. Опитайте отново.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <AnimateOnScroll direction="down" className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-cadetblue mb-3 tracking-wide [text-shadow:0_1px_2px_rgba(0,151,178,0.25)]">{t.title}</h1>
            <p className="text-graphite-light max-w-xl mx-auto">
              {t.subtitle}
            </p>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section background="light">
        <Container>
          <AnimateOnScroll direction="up">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-graphite mb-6">{t.contactInfoTitle}</h2>

              <div className="space-y-6">
                {contactInfoItems.map((item) => (
                  <ContactInfoItem key={item.title} {...item} />
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t">
                <div className="mb-5 flex flex-col items-start gap-2">
                  <img
                    src="/arthouseQRkod.png"
                    alt="Arthouse website QR code"
                    className="w-32 h-32 rounded-md border border-graphite/10 bg-white p-2 shadow-sm"
                  />
                  <p className="text-sm text-graphite-light">
                    {qrCaption}
                  </p>
                </div>
                <h3 className="text-graphite mb-4">{t.followUs}</h3>
                <div className="flex space-x-4">
                  {SOCIAL_LINKS.map((link) => (
                    <SocialLink key={link.label} {...link} />
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-graphite mb-2">{t.formTitle}</h2>
                <p className="text-graphite-light mb-6">
                  {t.formSubtitle}
                </p>

                {isSubmitted && <SuccessMessage message={t.successMessage} />}
                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-800 text-sm">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={labelStyle}>{t.yourName}</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                        placeholder={t.placeholderName}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelStyle}>{t.emailAddress}</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                        placeholder={t.placeholderEmail}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className={labelStyle}>{t.phone}</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder={t.placeholderPhone}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className={labelStyle}>{t.subject}</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={`${inputStyle} bg-white`}
                      >
                        {subjectOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelStyle}>{t.yourMessage}</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`${inputStyle} resize-none`}
                      placeholder={t.placeholderMessage}
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacyConsent"
                      name="privacyConsent"
                      checked={formData.privacyConsent}
                      onChange={handleChange}
                      required
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-graphite focus:ring-graphite shrink-0"
                      aria-describedby="privacyConsent-desc"
                    />
                    <label id="privacyConsent-desc" htmlFor="privacyConsent" className="text-sm text-gray-700">
                      {t.privacyConsent}{' '}
                      <Link href={`${prefix}/privacy`} className="text-graphite hover:underline">{t.privacyPolicy}</Link>
                      {' '}{t.andGdpr}
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="accent"
                      className="w-full md:w-auto"
                      disabled={!formData.privacyConsent || isSending}
                    >
                      <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                      {isSending ? (locale === 'en' ? 'Sending…' : 'Изпращане…') : t.sendMessage}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Map Section */}
      <Section background="white">
        <Container>
          <AnimateOnScroll direction="down">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-graphite mb-2">{t.whereToFind}</h2>
            <p className="text-graphite-light">{contactAddressShort}</p>
          </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up">
          {/* Вградена карта на локацията */}
          <div className="rounded-2xl overflow-hidden h-80 md:h-96 bg-gray-200">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(contactAddressShort)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t.mapTitle}
            />
          </div>
          <a
            href={GOOGLE_MAPS_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-4 text-graphite hover:text-graphite-dark"
          >
            {t.openInMaps}
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
          </a>
          </AnimateOnScroll>
        </Container>
      </Section>

      {/* Call-to-Action: свържете се с нас (Viber / WhatsApp) */}
      <section className="relative overflow-hidden bg-linear-to-br from-cadetblue via-cadetblue to-cadetblue-dark text-white py-16 md:py-20">
        {/* Декоративни „blobs“ на фона – леко пулсиращи */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/10 blur-3xl animate-pulse [animation-duration:6s]" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/5 blur-3xl animate-pulse [animation-duration:8s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-xl h-144 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]" />
        </div>

        <Container className="relative">
          <AnimateOnScroll direction="up" className="text-center mx-auto max-w-3xl">
            {/* Икона с „ripple“ ефект */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <span
                aria-hidden="true"
                className="absolute inline-flex h-16 w-16 rounded-full bg-white/40 opacity-75 animate-ping"
              />
              <span className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-sm">
                <PhoneIcon className="w-8 h-8 text-white" />
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-wide mb-4 [text-shadow:0_2px_8px_rgba(0,0,0,0.18)]">
              {t.callCtaTitle}
            </h2>
            <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto mb-3">
              {t.callCtaBody}
            </p>
            <a
              href={`tel:${CONTACT_PHONE_LINK}`}
              className="inline-flex items-center gap-2 text-lg md:text-xl font-semibold text-white hover:text-white/90 mb-8 transition-colors"
            >
              <PhoneIcon className="w-5 h-5" />
              {CONTACT_PHONE}
            </a>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Viber */}
              <a
                href={`viber://chat?number=${encodeURIComponent(CONTACT_PHONE_LINK)}`}
                aria-label={`Viber ${CONTACT_PHONE}`}
                className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#7360F2] text-white font-medium shadow-lg shadow-black/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-cadetblue"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-300"
                />
                <ViberIcon className="relative w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                <span className="relative">{t.callOnViber}</span>
                <span className="relative text-white/85 text-sm hidden sm:inline">
                  {CONTACT_PHONE}
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${CONTACT_PHONE_LINK.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${CONTACT_PHONE}`}
                className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#25D366] text-white font-medium shadow-lg shadow-black/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-cadetblue"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-300"
                />
                <WhatsAppIcon className="relative w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                <span className="relative">{t.callOnWhatsApp}</span>
                <span className="relative text-white/85 text-sm hidden sm:inline">
                  {CONTACT_PHONE}
                </span>
              </a>
            </div>
          </AnimateOnScroll>
        </Container>
      </section>
    </>
  );
}
