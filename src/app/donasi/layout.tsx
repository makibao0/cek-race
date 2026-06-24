import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donasi",
  description: "Dukung pengembang Cek Ras agar terus bisa bikin fitur seru. Scan QRIS dan traktir kopi! ☕",
};

export default function DonasiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
