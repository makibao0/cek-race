import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Baca Tarot",
  description: "Tarik 3 kartu tarot dan ungkap masa lalu, masa kini, serta masa depanmu. 78 kartu penuh misteri.",
};

export default function TarotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
