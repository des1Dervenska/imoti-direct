import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Имоти Директ - Недвижими имоти в България",
  description: "Вашият надежден партньор за покупко-продажба и наем на недвижими имоти в България. Апартаменти, къщи и парцели в София, Пловдив, Варна, Бургас и цяла България.",
  keywords: "имоти, недвижими имоти, апартаменти, къщи, парцели, продажба, наем, България, София, Пловдив, Варна",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
