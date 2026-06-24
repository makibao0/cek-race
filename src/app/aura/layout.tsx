import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Aura",
  description: "Ketahui warna aura dan energi spiritualmu hari ini. Temukan kekuatan tersembunyi dalam dirimu.",
};

export default function AuraLayout({ children }: { children: React.ReactNode }) {
  return children;
}
