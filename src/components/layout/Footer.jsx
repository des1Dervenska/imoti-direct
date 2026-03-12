import Link from 'next/link';
import {
  BRAND_NAME,
  BRAND_DESCRIPTION,
  BRAND_TAGLINE,
  CONTACT_ADDRESS_SHORT,
  CONTACT_PHONE,
  CONTACT_EMAIL,
} from '@/lib/constants';
import { QUICK_LINKS, USEFUL_LINKS } from '@/lib/footer.config';
import {
  HomeIcon,
  TwitterIcon,
  InstagramIcon,
  FacebookIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
} from '@/components/icons';

// Repeated styles
const linkStyle = 'text-gray-400 hover:text-white transition-colors';
const sectionTitle = 'text-lg font-semibold mb-4';
const iconStyle = 'w-5 h-5 text-blue-500 flex-shrink-0';
const contactText = 'text-gray-400 text-sm';

// Social links config
const SOCIAL_LINKS = [
  { Icon: TwitterIcon, href: '#', label: 'Twitter' },
  { Icon: InstagramIcon, href: '#', label: 'Instagram' },
  { Icon: FacebookIcon, href: '#', label: 'Facebook' },
];

// Contact info config
const CONTACT_INFO = [
  { Icon: MapPinIcon, value: CONTACT_ADDRESS_SHORT, iconClass: `${iconStyle} mt-0.5` },
  { Icon: PhoneIcon, value: CONTACT_PHONE, iconClass: iconStyle },
  { Icon: MailIcon, value: CONTACT_EMAIL, iconClass: iconStyle },
  { Icon: ClockIcon, value: 'Пон-Пет: 9:00 - 18:00', iconClass: iconStyle },
];

// Bottom links config
const BOTTOM_LINKS = [
  { label: 'Политика за поверителност', href: '#' },
  { label: 'Условия за ползване', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <HomeIcon className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">{BRAND_NAME}</span>
            </div>
            <p className={contactText}>
              {BRAND_DESCRIPTION}. {BRAND_TAGLINE}.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a key={label} href={href} className={linkStyle} aria-label={label}>
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={sectionTitle}>Бързи връзки</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkStyle}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className={sectionTitle}>Полезни връзки</h3>
            <ul className="space-y-2">
              {USEFUL_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkStyle}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={sectionTitle}>Контакти</h3>
            <ul className="space-y-3">
              {CONTACT_INFO.map(({ Icon, value, iconClass }) => (
                <li key={value} className="flex items-center space-x-3">
                  <Icon className={iconClass} />
                  <span className={contactText}>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={contactText}>
              &copy; {new Date().getFullYear()} {BRAND_NAME}. Всички права запазени.
            </p>
            <div className="flex space-x-6 text-sm">
              {BOTTOM_LINKS.map(({ label, href }) => (
                <a key={label} href={href} className={linkStyle}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
