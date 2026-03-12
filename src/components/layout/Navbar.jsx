'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND_NAME } from '@/lib/constants';
import { HomeIcon, MenuIcon } from '@/components/icons';

// Repeated styles
const navLinkStyle = 'block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600 md:p-0';
const ctaButtonStyle = 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors';
const mobileMenuBtnStyle = 'inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200';

// Navigation links config
const NAV_LINKS = [
  { label: 'Начало', href: '/' },
  { label: 'Продажби', href: '/sales' },
  { label: 'Наеми', href: '/rent' },
  { label: 'За нас', href: '/about' },
  { label: 'Контакти', href: '/contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <HomeIcon className="w-8 h-8 text-blue-600" />
          <span className="self-center text-xl font-bold whitespace-nowrap text-gray-900">
            {BRAND_NAME}
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className={mobileMenuBtnStyle}
          aria-controls="navbar-menu"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Отвори менюто</span>
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Navigation menu */}
        <div
          className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}
          id="navbar-menu"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={navLinkStyle} onClick={closeMenu}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex">
          <Link href="/contact" className={ctaButtonStyle}>
            Безплатна консултация
          </Link>
        </div>
      </div>
    </nav>
  );
}
