import { Geist, Geist_Mono, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { BRAND_NAME, BRAND_DESCRIPTION, BRAND_TAGLINE } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
});

/** Курсивен сериф за мотото в hero – по-„артистичен“ от sans */
const heroMotto = Cormorant_Garamond({
  variable: "--font-hero-motto",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700"],
  style: ["italic", "normal"],
});

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.arthouse94.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BRAND_NAME} - Недвижими имоти в България`,
  description: `${BRAND_DESCRIPTION}. ${BRAND_TAGLINE}. Покупко-продажба и наем на имоти в София и България.`,
  applicationName: BRAND_NAME,
  keywords: [
    "имоти",
    "недвижими имоти",
    "апартаменти",
    "къщи",
    "парцели",
    "продажба",
    "наем",
    "България",
    "София",
    "real estate",
    "property",
    "rent",
    "sale",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    languages: {
      bg: `${SITE_URL}/bg`,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/bg`,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${BRAND_NAME} - Недвижими имоти в България`,
    description: `${BRAND_DESCRIPTION}. ${BRAND_TAGLINE}.`,
    siteName: BRAND_NAME,
    locale: "bg_BG",
    alternateLocale: ["en_GB"],
    images: [
      {
        url: "/images/logo.jpg",
        alt: BRAND_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} - Недвижими имоти в България`,
    description: `${BRAND_DESCRIPTION}. ${BRAND_TAGLINE}.`,
    images: ["/images/logo.jpg"],
  },
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${heroMotto.variable} antialiased bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
