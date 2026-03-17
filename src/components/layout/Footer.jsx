import Link from 'next/link';
import {
  BRAND_NAME,
  CONTACT_ADDRESS_SHORT,
  CONTACT_ADDRESS_SHORT_EN,
  CONTACT_PHONE,
  CONTACT_EMAIL,
} from '@/lib/constants';
import { USEFUL_LINKS } from '@/lib/footer.config';
import { getTranslations } from '@/lib/translations';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { FacebookIcon } from '@/components/icons';
import Logo from '@/components/ui/Logo';

const footerBg = 'bg-gradient-to-b from-cadetblue to-cadetblue-dark text-white';
const linkStyle = 'text-white/70 hover:text-white transition-colors';
const sectionTitle = 'text-lg mb-4 text-white';
const iconStyle = 'w-5 h-5 text-white/80 flex-shrink-0';
const contactText = 'text-white/70 text-sm';
const borderStyle = 'border-white/20';

const SOCIAL_LINKS = [
  { Icon: FacebookIcon, href: 'https://www.facebook.com/profile.php?id=61580202105400', label: 'Facebook' },
];

export default function Footer({ locale = 'bg' }) {
  const t = getTranslations(locale);
  const prefix = `/${locale}`;

  const quickLinks = [
    { label: t.footerLinks.sales, href: `${prefix}/sales` },
    { label: t.footerLinks.rent, href: `${prefix}/rent` },
    { label: t.footerLinks.about, href: `${prefix}/about` },
    { label: t.footerLinks.contact, href: `${prefix}/contact` },
  ];

  const contactAddressShort = locale === 'en' ? CONTACT_ADDRESS_SHORT_EN : CONTACT_ADDRESS_SHORT;
  const contactInfo = [
    { Icon: MapPinIcon, value: contactAddressShort, iconClass: `${iconStyle} mt-0.5` },
    { Icon: PhoneIcon, value: CONTACT_PHONE, iconClass: iconStyle },
    { Icon: EnvelopeIcon, value: CONTACT_EMAIL, iconClass: iconStyle },
    { Icon: ClockIcon, value: t.footer.workingHoursShort, iconClass: iconStyle },
  ];

  const bottomLinks = [
    { label: t.footer.privacy, href: `${prefix}/privacy` },
    { label: t.footer.terms, href: `${prefix}/terms` },
  ];

  return (
    <footer className={`${footerBg} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href={prefix} className="flex items-center space-x-3">
              <Logo width={40} height={40} className="rounded bg-white/90 p-1" />
              <span className="text-xl text-white">{BRAND_NAME}</span>
            </Link>
            <p className={contactText}>
              {t.brand.description}. {t.brand.tagline}.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a key={label} href={href} className={linkStyle} aria-label={label}>
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className={sectionTitle}>{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkStyle}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={sectionTitle}>{t.footer.usefulLinks}</h3>
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

          <div>
            <h3 className={sectionTitle}>{t.footer.contacts}</h3>
            <ul className="space-y-3">
              {contactInfo.map(({ Icon, value, iconClass }) => (
                <li key={value} className="flex items-center space-x-3">
                  <Icon className={iconClass} />
                  <span className={contactText}>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`pt-8 border-t ${borderStyle}`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={contactText}>
              &copy; <span>{new Date().getFullYear()}</span> {BRAND_NAME}. {t.footer.allRightsReserved}.
            </p>
            <div className="flex space-x-6 text-sm">
              {bottomLinks.map(({ label, href }) => (
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
