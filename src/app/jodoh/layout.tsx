import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Kecocokan Weton",
  description: "Cek kecocokan weton dan jodoh berdasarkan primbon Jawa. Masukkan tanggal lahir kalian berdua dan lihat hasilnya.",
};

export default function JodohLayout({ children }: { children: React.ReactNode }) {
  return children;
}
