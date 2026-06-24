import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cek Ras — Cek Aura, Tarot & Zodiak",
    template: "%s | Cek Ras",
  },
  description: "Cek ras wajahmu, baca tarot, zodiak harian, dan aura energimu. 100% tidak ilmiah, 100% seru!",
  keywords: ["cek ras", "tarot", "zodiak", "cek aura", "ramalan bintang", "hiburan"],
  authors: [{ name: "Cek Ras" }],
  openGraph: {
    title: "Cek Ras — Cek Aura, Tarot & Zodiak",
    description: "Cek ras wajahmu, baca tarot, zodiak harian, dan aura energimu. 100% tidak ilmiah, 100% seru!",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-20">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
