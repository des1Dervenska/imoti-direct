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
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { BRAND_NAME } from "@/lib/constants";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = [
  { label: "Начало", href: "/" },
  { label: "Продажби", href: "/sales" },
  { label: "Наеми", href: "/rent" },
  { label: "За нас", href: "/about" },
  { label: "Контакти", href: "/contact" },
];

const desktopLinkStyle =
  "relative text-[15px] font-medium text-graphite/90 transition-colors duration-200 hover:text-cadetblue-dark";

const mobileLinkStyle =
  "block rounded-lg px-4 py-3 text-base font-medium text-graphite transition-colors hover:bg-gray-100 hover:text-cadetblue-dark";

const mobileMenuBtnStyle =
  "inline-flex items-center justify-center rounded-lg p-2 text-graphite transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          onClick={closeMenu}
        >
          <Logo width={34} height={34} priority className="object-contain" />
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-[0.01em] text-graphite sm:text-lg">
              {BRAND_NAME}
            </span>
            <span className="hidden text-[11px] uppercase tracking-[0.22em] text-graphite/55 sm:block">
              Real Estate
            </span>
          </div>
        </Link>

        <button
          type="button"
          className={mobileMenuBtnStyle}
          aria-controls="navbar-menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">
            {isMenuOpen ? "Затвори менюто" : "Отвори менюто"}
          </span>
          {isMenuOpen ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>

        <div className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={desktopLinkStyle}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="navbar-menu"
          className="border-t border-gray-200 bg-white md:hidden"
        >
          <div className="mx-auto max-w-screen-xl px-5 py-3">
            <ul className="space-y-1">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={mobileLinkStyle}
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
