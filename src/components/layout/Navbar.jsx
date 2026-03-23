// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { BRAND_NAME } from "@/lib/constants";
// import { HomeIcon, Bars3Icon } from "@heroicons/react/24/outline";
// import Logo from "@/components/ui/Logo";
// // Repeated styles
// const navLinkStyle =
//   "block py-2 px-3 text-graphite rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-graphite-dark md:p-0";
// const ctaButtonStyle =
//   "text-white bg-graphite hover:bg-graphite-dark focus:ring-4 focus:outline-none focus:ring-graphite/30 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors";
// const mobileMenuBtnStyle =
//   "inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200";

// // Navigation links config
// const NAV_LINKS = [
//   { label: "Начало", href: "/" },
//   { label: "Продажби", href: "/sales" },
//   { label: "Наеми", href: "/rent" },
//   { label: "За нас", href: "/about" },
//   { label: "Контакти", href: "/contact" },
// ];

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const closeMenu = () => setIsMenuOpen(false);

//   return (
//     <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0 start-0">
//       <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//         {/* <Logo width={150} height={70} priority /> */}
//         <Link href="/" className="flex items-center gap-2.5">
//           {/* <Link href="/" className="flex items-center space-x-3"> */}
//           <Logo width={30} height={30} priority />
//           {/* <HomeIcon className="w-8 h-8 text-graphite" /> */}
//           <span className="self-center text-xl font-bold whitespace-nowrap text-graphite">
//             {BRAND_NAME}
//           </span>
//         </Link>

//         {/* Mobile menu button */}
//         <button
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           type="button"
//           className={mobileMenuBtnStyle}
//           aria-controls="navbar-menu"
//           aria-expanded={isMenuOpen}
//         >
//           <span className="sr-only">Отвори менюто</span>
//           <Bars3Icon className="w-5 h-5" />
//         </button>

//         {/* Navigation menu */}
//         <div
//           className={`${isMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
//           id="navbar-menu"
//         >
//           <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white">
//             {NAV_LINKS.map(({ label, href }) => (
//               <li key={href}>
//                 <Link href={href} className={navLinkStyle} onClick={closeMenu}>
//                   {label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { BRAND_NAME_WITHOUT_NUMBER, BRAND_NAME_NUMBER } from "@/lib/constants";
import Logo from "@/components/ui/Logo";
import { getTranslations } from "@/lib/translations";
import { LOCALES } from "@/lib/i18n";

const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getDesktopLinkClass(isActive) {
  const base =
    "relative py-2.5 text-[17px] tracking-tight transition-all duration-300 ease-out";
  const active =
    "text-[#0097b2] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[#0097b2] after:content-['']";
  const inactive =
    "text-graphite/85 hover:text-[#0097b2] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-0 after:rounded-full after:bg-[#0097b2] after:content-[''] after:transition-all after:duration-300 after:ease-out hover:after:left-0 hover:after:right-0 hover:after:w-full";
  return `${base} ${isActive ? active : inactive}`;
}

function getMobileLinkClass(isActive) {
  const base = "block rounded-lg px-4 py-3 text-base transition-colors border-l-4";
  const active = "border-[#0097b2] bg-[#0097b2]/10 text-[#0097b2]";
  const inactive = "border-transparent text-graphite hover:bg-gray-100 hover:text-[#0097b2]";
  return `${base} ${isActive ? active : inactive}`;
}

const mobileMenuBtnStyle =
  "inline-flex items-center justify-center rounded-lg p-2 text-graphite transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden";

const navKeys = [
  { key: "home", href: "" },
  { key: "sales", href: "sales" },
  { key: "rent", href: "rent" },
  { key: "about", href: "about" },
  { key: "contact", href: "contact" },
];

function setLocaleCookie(locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

export default function Navbar({ locale = "bg" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = getTranslations(locale);

  const navLinks = navKeys.map(({ key, href }) => ({
    label: t.nav[key],
    href: href ? `/${locale}/${href}` : `/${locale}`,
  }));

  const otherLocale = LOCALES.find((l) => l !== locale);
  const pathWithoutLocale = pathname.replace(/^\/(bg|en)/, "") || "";
  const switchHref = `/${otherLocale}${pathWithoutLocale}`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-[#fbf7f4]/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
          onClick={closeMenu}
        >
          <Logo
            width={92}
            height={92}
            priority
            className="h-20 w-20 object-contain sm:h-14 sm:w-14 md:h-[92px] md:w-[92px]"
          />
          <div className="flex flex-col leading-none">
            <span className="brand-name-sans text-base tracking-[0.02em] text-graphite sm:text-xl">
              {BRAND_NAME_WITHOUT_NUMBER}{BRAND_NAME_NUMBER}
            </span>
            <span className="brand-name-sans hidden text-[11px] uppercase tracking-[0.22em] text-graphite/55 sm:block">
              {t.brand.taglineSub}
            </span>
          </div>
        </Link>

        {/* Desktop: nav links – по-големи, подчертаване и цвят #0097b2 при актив/ hover */}
        <div className="hidden md:flex md:items-center">
          <ul className="flex items-center gap-10">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={getDesktopLinkClass(isActive)}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: на тел първо език, най-вдясно иконата за спускане на менюто */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white/90 shadow-sm p-1">
            {LOCALES.map((l) =>
              l === locale ? (
                <span
                  key={l}
                  className="rounded-lg px-3 py-2 text-sm bg-[#0097b2] text-white shadow-sm"
                  aria-label={l === "bg" ? "Български" : "English"}
                  aria-current="true"
                >
                  {l.toUpperCase()}
                </span>
              ) : (
                <Link
                  key={l}
                  href={`/${l}${pathWithoutLocale}`}
                  onClick={() => setLocaleCookie(l)}
                  className="rounded-lg px-3 py-2 text-sm text-graphite/80 hover:bg-[#0097b2]/10 hover:text-[#0097b2] transition-colors duration-200"
                  aria-label={l === "bg" ? "Български" : "English"}
                >
                  {l.toUpperCase()}
                </Link>
              )
            )}
          </div>

          <button
            type="button"
            className={mobileMenuBtnStyle}
            aria-controls="navbar-menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">
              {isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
            </span>
            {isMenuOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu – само навигационни линкове, без избор на език */}
      <div
        id="navbar-menu"
        className={`absolute left-0 right-0 top-full overflow-hidden border-t border-gray-200/80 bg-[#fbf7f4] md:hidden transition-[max-height] duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[70vh]" : "max-h-0"
        }`}
      >
        <div
          className={`transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
        <div className="mx-auto max-w-7xl px-5 py-3">
            <ul className="space-y-1">
              {navLinks.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={getMobileLinkClass(isActive)}
                      onClick={closeMenu}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
