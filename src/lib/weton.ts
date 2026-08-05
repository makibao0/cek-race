export type HariNama = 'Minggu' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
export type PasaranNama = 'Legi' | 'Pahing' | 'Pon' | 'Wage' | 'Kliwon';

export type Weton = {
  hari: HariNama;
  pasaran: PasaranNama;
  neptuHari: number;
  neptuPasaran: number;
  neptu: number;
};

const HARI_NAMES: HariNama[] = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const NEPTU_HARI: Record<HariNama, number> = {
  Minggu: 5,
  Senin: 4,
  Selasa: 3,
  Rabu: 7,
  Kamis: 8,
  Jumat: 6,
  Sabtu: 9,
};

const PASARAN_NAMES: PasaranNama[] = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

const NEPTU_PASARAN: Record<PasaranNama, number> = {
  Legi: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
  Kliwon: 8,
};

// 17 Agustus 1945 = Jumat Legi (hari kemerdekaan RI, acuan yang mudah diverifikasi).
const PASARAN_ANCHOR = new Date(1945, 7, 17);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getWeton(dateStr: string): Weton {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const hari = HARI_NAMES[date.getDay()];

  const diffDays = Math.round((date.getTime() - PASARAN_ANCHOR.getTime()) / MS_PER_DAY);
  const pasaranIndex = ((diffDays % 5) + 5) % 5;
  const pasaran = PASARAN_NAMES[pasaranIndex];

  const neptuHari = NEPTU_HARI[hari];
  const neptuPasaran = NEPTU_PASARAN[pasaran];

  return { hari, pasaran, neptuHari, neptuPasaran, neptu: neptuHari + neptuPasaran };
}

export const KATEGORI_ORDER = [
  'Pegat', 'Ratu', 'Jodoh', 'Topo', 'Tinari', 'Padu', 'Sujanan', 'Pesthi',
] as const;

export function getKategoriNama(neptuA: number, neptuB: number): (typeof KATEGORI_ORDER)[number] {
  const total = neptuA + neptuB;
  const sisa = total % 8;
  const index = sisa === 0 ? 7 : sisa - 1;
  return KATEGORI_ORDER[index];
}
