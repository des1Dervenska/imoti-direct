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
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { FacebookIcon } from '@/components/icons';
import Logo from '@/components/ui/Logo';

// Styles
const footerBg = 'bg-gradient-to-b from-cadetblue to-cadetblue-dark text-white';
const linkStyle = 'text-white/70 hover:text-white transition-colors';
const sectionTitle = 'text-lg font-bold mb-4 text-white';
const iconStyle = 'w-5 h-5 text-white/80 flex-shrink-0';
const contactText = 'text-white/70 text-sm';
const borderStyle = 'border-white/20';

// Social links config
const SOCIAL_LINKS = [
  { Icon: FacebookIcon, href: 'https://www.facebook.com/profile.php?id=61580202105400', label: 'Facebook' },
];

// Contact info config
const CONTACT_INFO = [
  { Icon: MapPinIcon, value: CONTACT_ADDRESS_SHORT, iconClass: `${iconStyle} mt-0.5` },
  { Icon: PhoneIcon, value: CONTACT_PHONE, iconClass: iconStyle },
  { Icon: EnvelopeIcon, value: CONTACT_EMAIL, iconClass: iconStyle },
  { Icon: ClockIcon, value: 'Пон-Пет: 9:00 - 18:00', iconClass: iconStyle },
];

// Bottom links config (вътрешни страници)
const BOTTOM_LINKS = [
  { label: 'Политика за поверителност', href: '/privacy' },
  { label: 'Условия за ползване', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className={`${footerBg} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <Logo width={40} height={40} className="rounded bg-white/90 p-1" />
              <span className="text-xl font-bold text-white">{BRAND_NAME}</span>
            </Link>
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
        <div className={`pt-8 border-t ${borderStyle}`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={contactText}>
              &copy; {new Date().getFullYear()} {BRAND_NAME}. Всички права запазени.
            </p>
            <div className="flex space-x-6 text-sm">
              {BOTTOM_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} className={linkStyle}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
