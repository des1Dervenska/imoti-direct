'use client';

import { useState } from 'react';
import {
  CONTACT_ADDRESS,
  CONTACT_CITY,
  CONTACT_PHONE,
  CONTACT_PHONE_LINK,
  CONTACT_EMAIL,
  CONTACT_ADDRESS_SHORT,
  WORKING_HOURS,
  GOOGLE_MAPS_SEARCH_URL,
} from '@/lib/constants';
import { Section, Container, Card, Button } from '@/components/ui';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { FacebookIcon, InstagramIcon } from '@/components/icons';

// Config: Contact info items
const CONTACT_INFO = [
  {
    icon: MapPinIcon,
    title: 'Адрес',
    content: (
      <>
        {CONTACT_ADDRESS}<br />
        {CONTACT_CITY}
      </>
    ),
  },
  {
    icon: PhoneIcon,
    title: 'Телефон',
    content: (
      <a href={`tel:${CONTACT_PHONE_LINK}`} className="hover:text-graphite transition-colors">
        {CONTACT_PHONE}
      </a>
    ),
  },
  {
    icon: EnvelopeIcon,
    title: 'Имейл',
    content: (
      <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-graphite transition-colors">
        {CONTACT_EMAIL}
      </a>
    ),
  },
  {
    icon: ClockIcon,
    title: 'Работно време',
    content: (
      <>
        <span className="block">{WORKING_HOURS.weekdays}</span>
        <span className="block">{WORKING_HOURS.saturday}</span>
        <span className="block">{WORKING_HOURS.sunday}</span>
      </>
    ),
  },
];

// Config: Social links
const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
];

// Config: Subject options
const SUBJECT_OPTIONS = [
  { value: '', label: 'Изберете тема' },
  { value: 'buy', label: 'Искам да купя имот' },
  { value: 'sell', label: 'Искам да продам имот' },
  { value: 'rent', label: 'Търся имот под наем' },
  { value: 'rent-out', label: 'Искам да отдам имот под наем' },
  { value: 'evaluation', label: 'Оценка на имот' },
  { value: 'consultation', label: 'Консултация' },
  { value: 'other', label: 'Друго' },
];

// Styles
const inputStyle = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-graphite text-graphite';
const labelStyle = 'block text-sm font-medium text-gray-700 mb-2';

// Helper: Contact info item
function ContactInfoItem({ icon: Icon, title, content }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 bg-graphite/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-graphite" />
      </div>
      <div>
        <h3 className="font-semibold text-graphite mb-1">{title}</h3>
        <p className="text-graphite-light">{content}</p>
      </div>
    </div>
  );
}

// Helper: Social link button
function SocialLink({ icon: Icon, href, label }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-graphite-light hover:bg-graphite hover:text-white transition-colors"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

// Helper: Success message
function SuccessMessage() {
  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
      <span className="text-green-800">
        Благодарим ви! Вашето съобщение беше изпратено успешно. Ще се свържем с вас скоро.
      </span>
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <>
      {/* Page Header */}
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-graphite mb-3">Контакти</h1>
            <p className="text-graphite-light max-w-xl mx-auto">
              Свържете се с нас - ще се радваме да отговорим на вашите въпроси
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section background="light">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-graphite mb-6">Информация за контакт</h2>

              <div className="space-y-6">
                {CONTACT_INFO.map((item) => (
                  <ContactInfoItem key={item.title} {...item} />
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold text-graphite mb-4">Последвайте ни</h3>
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
                <h2 className="text-2xl font-bold text-graphite mb-2">Изпратете запитване</h2>
                <p className="text-graphite-light mb-6">
                  Попълнете формата и ние ще се свържем с вас възможно най-скоро.
                </p>

                {isSubmitted && <SuccessMessage />}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={labelStyle}>Вашето име *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                        placeholder="Иван Иванов"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelStyle}>Имейл адрес *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                        placeholder="ivan@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className={labelStyle}>Телефон</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="+359 888 123 456"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className={labelStyle}>Относно *</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={`${inputStyle} bg-white`}
                      >
                        {SUBJECT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelStyle}>Вашето съобщение *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`${inputStyle} resize-none`}
                      placeholder="Опишете какво търсите или с какво можем да ви помогнем..."
                    />
                  </div>

                  <p className="text-sm text-gray-500">
                    С изпращането на тази форма се съгласявате с нашата{' '}
                    <a href="#" className="text-graphite hover:underline">политика за поверителност</a>.
                  </p>

                  <Button type="submit" variant="accent" className="w-full md:w-auto">
                    <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                    Изпрати съобщението
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Map Section */}
      <Section background="white">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-graphite mb-2">Къде да ни намерите</h2>
            <p className="text-graphite-light">{CONTACT_ADDRESS_SHORT}</p>
          </div>

          {/* Вградена карта на локацията */}
          <div className="rounded-2xl overflow-hidden h-80 md:h-96 bg-gray-200">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT_ADDRESS_SHORT)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Локация на офиса"
            />
          </div>
          <a
            href={GOOGLE_MAPS_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-4 text-graphite hover:text-graphite-dark font-medium"
          >
            Отвори в Google Maps
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
          </a>
        </Container>
      </Section>
    </>
  );
}
