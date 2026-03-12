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
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  MapIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { FacebookIcon, InstagramIcon } from '@/components/icons';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <>
      {/* Page Header */}
      <section className="pt-8 pb-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-graphite mb-3">
              Контакти
            </h1>
            <p className="text-graphite-light max-w-xl mx-auto">
              Свържете се с нас - ще се радваме да отговорим на вашите въпроси
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-graphite mb-6">
                Информация за контакт
              </h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-graphite/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-6 h-6 text-graphite" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-graphite mb-1">Адрес</h3>
                    <p className="text-graphite-light">
                      {CONTACT_ADDRESS}<br />
                      {CONTACT_CITY}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-graphite/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-6 h-6 text-graphite" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-graphite mb-1">Телефон</h3>
                    <p className="text-graphite-light">
                      <a href={`tel:${CONTACT_PHONE_LINK}`} className="hover:text-graphite transition-colors">
                        {CONTACT_PHONE}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-graphite/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-6 h-6 text-graphite" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-graphite mb-1">Имейл</h3>
                    <p className="text-graphite-light">
                      <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-graphite transition-colors">
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-graphite/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-6 h-6 text-graphite" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-graphite mb-1">Работно време</h3>
                    <p className="text-graphite-light">{WORKING_HOURS.weekdays}</p>
                    <p className="text-graphite-light">{WORKING_HOURS.saturday}</p>
                    <p className="text-graphite-light">{WORKING_HOURS.sunday}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold text-graphite mb-4">Последвайте ни</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-graphite-light hover:bg-graphite hover:text-white transition-colors">
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-graphite-light hover:bg-graphite hover:text-white transition-colors">
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-graphite mb-2">
                  Изпратете запитване
                </h2>
                <p className="text-graphite-light mb-6">
                  Попълнете формата и ние ще се свържем с вас възможно най-скоро.
                </p>

                {/* Success Message */}
                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-green-800">Благодарим ви! Вашето съобщение беше изпратено успешно. Ще се свържем с вас скоро.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Вашето име *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-graphite text-graphite"
                        placeholder="Иван Иванов"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Имейл адрес *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-graphite text-graphite"
                        placeholder="ivan@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-graphite text-graphite"
                        placeholder="+359 888 123 456"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Относно *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-graphite text-graphite bg-white"
                      >
                        <option value="">Изберете тема</option>
                        <option value="buy">Искам да купя имот</option>
                        <option value="sell">Искам да продам имот</option>
                        <option value="rent">Търся имот под наем</option>
                        <option value="rent-out">Искам да отдам имот под наем</option>
                        <option value="evaluation">Оценка на имот</option>
                        <option value="consultation">Консултация</option>
                        <option value="other">Друго</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Вашето съобщение *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-graphite focus:border-graphite text-graphite resize-none"
                      placeholder="Опишете какво търсите или с какво можем да ви помогнем..."
                    />
                  </div>

                  {/* Privacy note */}
                  <p className="text-sm text-gray-500">
                    С изпращането на тази форма се съгласявате с нашата{' '}
                    <a href="#" className="text-graphite hover:underline">политика за поверителност</a>.
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-cadetblue hover:bg-cadetblue-dark text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-cadetblue/30 flex items-center justify-center"
                  >
                    <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                    Изпрати съобщението
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-graphite mb-2">Къде да ни намерите</h2>
            <p className="text-graphite-light">{CONTACT_ADDRESS_SHORT}</p>
          </div>

          {/* Map placeholder */}
          <div className="bg-gray-200 rounded-2xl h-80 md:h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapIcon className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Google Maps</p>
              <p className="text-sm">{CONTACT_ADDRESS_SHORT}</p>
              <a
                href={GOOGLE_MAPS_SEARCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 text-graphite hover:text-graphite-dark font-medium"
              >
                Отвори в Google Maps
                <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
