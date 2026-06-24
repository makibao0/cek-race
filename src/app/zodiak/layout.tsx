import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Zodiak",
  description: "Baca ramalan bintang harianmu berdasarkan tanggal lahir. Karir, asmara, finansial, dan kesehatan.",
};

export default function ZodiakLayout({ children }: { children: React.ReactNode }) {
  return children;
}
