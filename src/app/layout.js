import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
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

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata = {
  title: `${BRAND_NAME} - Недвижими имоти в България`,
  description: `${BRAND_DESCRIPTION}. ${BRAND_TAGLINE}. Покупко-продажба и наем на имоти в София и България.`,
  keywords: "имоти, недвижими имоти, апартаменти, къщи, парцели, продажба, наем, България, София",
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
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
