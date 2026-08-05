# Cek Kecocokan Weton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambah fitur baru "Cek Kecocokan Weton" (`/jodoh`) yang menghitung kecocokan jodoh dua orang berdasarkan weton (hari + pasaran) memakai metode Petung Jodoh dalam primbon Jawa.

**Architecture:** Satu halaman client component baru (`src/app/jodoh/page.tsx`) memakai fungsi kalkulasi murni di `src/lib/weton.ts` dan data kategori statis di `src/data/jodoh.json`, lalu merender hasil lewat komponen `src/components/JodohResult.tsx`. Pola ini identik dengan fitur Zodiak yang sudah ada (`src/app/zodiak/page.tsx` + `src/components/ZodiakResult.tsx`), hanya beda: logika tanggal diekstrak ke file lib terpisah karena lebih kompleks (2 orang, beberapa fungsi kalkulasi) dibanding kalkulasi zodiak yang cuma 1 fungsi.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, `lucide-react` (ikon), `html-to-image` (share hasil sebagai gambar). Tidak ada dependency baru yang ditambahkan.

## Global Constraints

- Tidak ada dependency baru ditambahkan ke `package.json` — semua kalkulasi memakai JS/TS murni bawaan.
- Tidak ada test otomatis ditulis — proyek ini tidak punya test runner, dan user akan menguji secara manual di browser. Verifikasi tiap task dilakukan lewat build/typecheck dan (untuk `weton.ts`) skrip verifikasi sekali-pakai yang dihapus setelah dipakai.
- Tanggal acuan pasaran: **17 Agustus 1945 = Jumat Legi** (sudah divalidasi lewat dua tanggal bersejarah yang wetonnya publik diketahui: 17 Agustus 1945 = Jumat Legi, dan 21 Mei 1998 = Kamis Legi).
- Tabel neptu hari: Minggu 5, Senin 4, Selasa 3, Rabu 7, Kamis 8, Jumat 6, Sabtu 9.
- Tabel neptu pasaran: Legi 5, Pahing 9, Pon 7, Wage 4, Kliwon 8.
- Urutan kategori Petung Jodoh berdasar `(neptuA + neptuB) % 8` (sisa 0 = kelipatan 8 = Pesthi): 1 Pegat, 2 Ratu, 3 Jodoh, 4 Topo, 5 Tinari, 6 Padu, 7 Sujanan, 8 Pesthi.
- Copy/teks berbahasa Indonesia santai (gaya sama seperti isi `src/data/zodiak.json`), bukan bahasa formal kaku.
- Route: `/jodoh`, label nav: "Jodoh", ikon: `HeartHandshake` dari `lucide-react` (export sudah dikonfirmasi ada), skema warna nav: fuchsia.
- Ikuti pola file yang sudah ada persis: `'use client'` di halaman & komponen hasil, struktur form → animasi "ritual" → hasil, tombol share pakai `toPng` dari `html-to-image` dengan fallback download + copy caption bila `navigator.share` tidak tersedia.

---

### Task 1: Modul kalkulasi weton (`src/lib/weton.ts`)

**Files:**
- Create: `src/lib/weton.ts`

**Interfaces:**
- Consumes: tidak ada (modul pertama, tidak bergantung task lain)
- Produces:
  - `type HariNama = 'Minggu'|'Senin'|'Selasa'|'Rabu'|'Kamis'|'Jumat'|'Sabtu'`
  - `type PasaranNama = 'Legi'|'Pahing'|'Pon'|'Wage'|'Kliwon'`
  - `type Weton = { hari: HariNama; pasaran: PasaranNama; neptuHari: number; neptuPasaran: number; neptu: number }`
  - `function getWeton(dateStr: string): Weton` — `dateStr` format `'YYYY-MM-DD'` (dari `<input type="date">`)
  - `const KATEGORI_ORDER: readonly ['Pegat','Ratu','Jodoh','Topo','Tinari','Padu','Sujanan','Pesthi']`
  - `function getKategoriNama(neptuA: number, neptuB: number): typeof KATEGORI_ORDER[number]`

- [ ] **Step 1: Tulis file `src/lib/weton.ts`**

```ts
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
```

- [ ] **Step 2: Verifikasi manual dengan skrip sekali-pakai**

Buat file sementara `/tmp/verify-weton.mjs` (di luar repo, JANGAN dikomit) berisi salinan logika di atas dalam plain JS (bukan import langsung, supaya tidak bergantung pada resolusi module TS), lalu jalankan untuk mengecek terhadap dua tanggal bersejarah yang wetonnya publik diketahui:

```bash
cat > /tmp/verify-weton.mjs << 'EOF'
const HARI_NAMES = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const NEPTU_HARI = { Minggu:5, Senin:4, Selasa:3, Rabu:7, Kamis:8, Jumat:6, Sabtu:9 };
const PASARAN_NAMES = ['Legi','Pahing','Pon','Wage','Kliwon'];
const NEPTU_PASARAN = { Legi:5, Pahing:9, Pon:7, Wage:4, Kliwon:8 };
const PASARAN_ANCHOR = new Date(1945, 7, 17);

function getWeton(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const hari = HARI_NAMES[date.getDay()];
  const diffDays = Math.round((date.getTime() - PASARAN_ANCHOR.getTime()) / 86400000);
  const pasaranIndex = ((diffDays % 5) + 5) % 5;
  const pasaran = PASARAN_NAMES[pasaranIndex];
  return { hari, pasaran, neptu: NEPTU_HARI[hari] + NEPTU_PASARAN[pasaran] };
}

console.log('1945-08-17 (expect Jumat Legi):', JSON.stringify(getWeton('1945-08-17')));
console.log('1998-05-21 (expect Kamis Legi):', JSON.stringify(getWeton('1998-05-21')));
EOF
node /tmp/verify-weton.mjs
```

Expected output: baris pertama menunjukkan `"hari":"Jumat","pasaran":"Legi"`, baris kedua menunjukkan `"hari":"Kamis","pasaran":"Legi"`. Kalau cocok, hapus `/tmp/verify-weton.mjs` — logika di `src/lib/weton.ts` sudah benar karena dua acuan independen konsisten.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: tidak ada error yang menyebut `src/lib/weton.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/weton.ts
git commit -m "feat: add weton calculation library"
```

---

### Task 2: Data kategori Petung Jodoh (`src/data/jodoh.json`)

**Files:**
- Create: `src/data/jodoh.json`

**Interfaces:**
- Consumes: tidak ada
- Produces: array 8 objek dengan bentuk `{ nama: string; arti: string; emoji: string; warna: string; deskripsi: string[]; saran: string[] }`, `nama` untuk tiap entri **harus** persis salah satu dari `KATEGORI_ORDER` di Task 1 (`'Pegat' | 'Ratu' | 'Jodoh' | 'Topo' | 'Tinari' | 'Padu' | 'Sujanan' | 'Pesthi'`) karena Task 3 mencari entri via `jodohData.find(k => k.nama === kategoriNama)`.

- [ ] **Step 1: Tulis file `src/data/jodoh.json`**

```json
[
  {
    "nama": "Pegat",
    "arti": "Cerai / Banyak Rintangan Besar",
    "emoji": "💔",
    "warna": "#ef4444",
    "deskripsi": [
      "Weton kalian ketemu di kombinasi Pegat — primbon bilang ini jalan yang penuh kerikil gede: banyak godaan, banyak drama, dan kesabaran bakal diuji abis-abisan.",
      "Pegat artinya 'putus'. Klasiknya sih ini kombinasi yang dianggap rawan cerai kalau nggak diusahain sama-sama — tapi inget, weton cuma peta, bukan takdir mutlak.",
      "Kombinasi Pegat biasanya identik sama hubungan yang naik-turunnya ekstrem. Seru sih, tapi capek juga kalau nggak ada yang mau ngalah.",
      "Primbon Jawa nyebut Pegat sebagai weton yang 'gampang pecah'. Bukan berarti nggak bisa langgeng, tapi emang butuh effort ekstra dari dua belah pihak."
    ],
    "saran": [
      "Kalau kalian di kategori ini, kuncinya cuma satu: komunikasi jujur. Jangan simpan kesel sendiri sampai numpuk jadi bom waktu.",
      "Coba lebih sering ngobrol soal ekspektasi masing-masing sebelum ambil keputusan besar bareng.",
      "Weton cuma panduan, bukan vonis. Banyak pasangan Pegat yang tetep langgeng karena mau belajar dan berubah bareng."
    ]
  },
  {
    "nama": "Ratu",
    "arti": "Rukun & Disegani",
    "emoji": "👑",
    "warna": "#f59e0b",
    "deskripsi": [
      "Ratu itu salah satu kombinasi paling favorit di primbon — artinya hubungan kalian bakal dihormati dan jadi panutan orang-orang sekitar.",
      "Weton Ratu identik sama pasangan yang keliatan 'serasi' dari luar: saling dukung dan jarang bikin ribut di depan umum.",
      "Kalau kalian dapet Ratu, primbon bilang kalian punya wibawa sebagai pasangan — orang lain segan sama hubungan kalian.",
      "Ratu artinya raja-ratu. Katanya pasangan dengan weton ini gampang disegani lingkungan sekitar, entah keluarga atau circle pertemanan."
    ],
    "saran": [
      "Manfaatin 'wibawa' ini buat jadi contoh yang baik, bukan buat gengsi-gengsian doang.",
      "Tetep rendah hati ya, jangan sampai kelihatan serasi di luar tapi kosong komunikasinya di dalam.",
      "Pertahankan kekompakan kalian dengan tetap saling dengerin, bukan cuma saling tunjuk ke orang lain."
    ]
  },
  {
    "nama": "Jodoh",
    "arti": "Cocok & Saling Melengkapi",
    "emoji": "💞",
    "warna": "#ec4899",
    "deskripsi": [
      "Namanya juga Jodoh — ini kombinasi yang katanya paling 'klop' secara alami, kayak emang udah didesain buat saling melengkapi.",
      "Weton Jodoh dipercaya bikin hubungan ngalir aja tanpa banyak drama. Chemistry-nya emang beda.",
      "Primbon nyebut kombinasi ini paling gampang nyambung, dari hal kecil kayak selera makan sampai obrolan berat.",
      "Kalau ketemu Jodoh, katanya sih kalian emang 'ditakdirkan' buat jalan bareng — meski tetep, usaha tetep nomor satu."
    ],
    "saran": [
      "Jangan cepet puas cuma karena 'katanya cocok'. Chemistry tetep butuh dirawat, bukan dibiarin auto-pilot.",
      "Manfaatin kecocokan ini buat saling support mimpi masing-masing, bukan cuma nyaman doang.",
      "Tetap jaga komunikasi meski berasa udah nyambung — biar nggak keburu baper pas ada beda pendapat."
    ]
  },
  {
    "nama": "Topo",
    "arti": "Banyak Ujian, Berbuah Manis",
    "emoji": "🧘",
    "warna": "#6366f1",
    "deskripsi": [
      "Topo artinya 'bertapa' — hubungan kalian dipercaya bakal ngelewatin banyak ujian dulu sebelum akhirnya manis di akhir.",
      "Kombinasi ini identik sama proses panjang: banyak halangan di awal, tapi hasilnya sepadan kalau sabar.",
      "Primbon bilang Topo itu kayak 'nabung kesabaran' — makin banyak diuji, makin kuat pondasinya nanti.",
      "Weton Topo biasanya diartikan sebagai hubungan yang harus 'berjuang dulu' sebelum nemu ketenangan."
    ],
    "saran": [
      "Anggap tantangan yang dateng sebagai proses, bukan alasan buat nyerah duluan.",
      "Jangan buru-buru insecure kalau awal-awal berasa berat — banyak pasangan Topo yang justru makin solid di jangka panjang.",
      "Rayain progress kecil bareng-bareng, biar prosesnya nggak berasa berat sendirian."
    ]
  },
  {
    "nama": "Tinari",
    "arti": "Lancar Rezeki",
    "emoji": "💰",
    "warna": "#10b981",
    "deskripsi": [
      "Tinari itu soal rezeki — kombinasi ini dipercaya bikin urusan finansial kalian relatif lancar kalau dijalani bareng.",
      "Weton Tinari sering diartikan sebagai pasangan yang 'murah rezeki', apalagi kalau kerja sama ngatur keuangan.",
      "Primbon bilang Tinari itu berkahnya di sisi kecukupan — nggak harus kaya raya, tapi selalu ada aja jalan keluar soal duit.",
      "Kombinasi ini katanya bikin kalian sama-sama punya insting yang oke soal cari peluang dan rezeki."
    ],
    "saran": [
      "Rezeki lancar tetep butuh dikelola bareng — coba biasain diskusi keuangan dari sekarang biar makin solid.",
      "Manfaatin momentum ini buat mulai nabung atau bangun rencana masa depan bareng.",
      "Jangan lupa syukurin proses kecilnya, nggak cuma fokus ke hasil akhir doang."
    ]
  },
  {
    "nama": "Padu",
    "arti": "Sering Berantem, Tapi Tetap Bersama",
    "emoji": "⚡",
    "warna": "#f97316",
    "deskripsi": [
      "Padu artinya 'bertengkar' — tapi tenang, ini bukan tipe berantem yang berujung putus, lebih ke drama kecil yang bumbu-bumbu doang.",
      "Weton Padu identik sama pasangan yang berisik pas berantem tapi baikan lagi secepat kilat.",
      "Primbon nyebut kombinasi ini punya energi yang 'panas' — gampang beda pendapat, tapi juga gampang balik akur.",
      "Kalau kalian sering cekcok soal hal kecil tapi tetep balik lagi, ya emang gitu ciri khas weton Padu."
    ],
    "saran": [
      "Coba latihan 'berantem sehat' — boleh beda pendapat, asal nggak saling nyakitin kata-kata.",
      "Jangan biarin drama kecil numpuk jadi masalah besar, selesaikan pelan-pelan tiap ada yang mengganjal.",
      "Humor bisa jadi senjata ampuh buat nyairin suasana pas lagi panas-panasnya."
    ]
  },
  {
    "nama": "Sujanan",
    "arti": "Rawan Godaan & Masalah Finansial",
    "emoji": "🌪️",
    "warna": "#dc2626",
    "deskripsi": [
      "Sujanan katanya rawan godaan dari luar, entah itu soal setia atau soal duit — primbon nyaranin buat extra hati-hati.",
      "Weton ini identik sama ujian kepercayaan — bukan berarti pasti kejadian, tapi kewaspadaan tetep perlu.",
      "Kombinasi Sujanan sering dikaitin sama drama finansial atau pihak ketiga yang bikin ribet kalau nggak dijaga komunikasinya.",
      "Primbon bilang Sujanan itu weton yang 'gampang tergoda' — makanya kepercayaan jadi kunci utama."
    ],
    "saran": [
      "Bangun kepercayaan dari hal kecil — transparansi soal keuangan dan pertemanan bisa banget nolong.",
      "Jangan gampang termakan omongan orang luar soal hubungan kalian sendiri.",
      "Kalau ada yang bikin nggak nyaman, omongin langsung — jangan dipendam sampai jadi kecurigaan berlebihan."
    ]
  },
  {
    "nama": "Pesthi",
    "arti": "Rukun & Harmonis Sampai Tua",
    "emoji": "🕊️",
    "warna": "#8b5cf6",
    "deskripsi": [
      "Pesthi adalah kombinasi yang paling banyak diincer — katanya bikin hubungan adem, rukun, dan awet sampai tua.",
      "Weton Pesthi identik sama ketenangan: nggak banyak drama, lebih ke saling nyaman satu sama lain.",
      "Primbon nyebut Pesthi sebagai simbol keharmonisan jangka panjang — pondasinya emang dari awal udah kuat.",
      "Kalau dapet Pesthi, katanya kalian tipe pasangan yang 'anteng' tapi solid, jarang ribut besar."
    ],
    "saran": [
      "Jaga terus komunikasi meski berasa udah adem — hubungan yang tenang tetep butuh usaha, bukan dibiarin gitu aja.",
      "Manfaatin keharmonisan ini buat saling bantu berkembang, bukan cuma nyaman di zona aman.",
      "Sesekali coba hal baru bareng biar hubungan yang adem ini tetep seru dan nggak monoton."
    ]
  }
]
```

- [ ] **Step 2: Validasi JSON**

Run: `node -e "const d = require('./src/data/jodoh.json'); console.log(d.length, d.map(k => k.nama))"`
Expected: `8 [ 'Pegat', 'Ratu', 'Jodoh', 'Topo', 'Tinari', 'Padu', 'Sujanan', 'Pesthi' ]`

- [ ] **Step 3: Commit**

```bash
git add src/data/jodoh.json
git commit -m "feat: add jodoh compatibility category data"
```

---

### Task 3: Halaman Cek Weton (`src/app/jodoh/layout.tsx` + `src/app/jodoh/page.tsx`)

**Files:**
- Create: `src/app/jodoh/layout.tsx`
- Create: `src/app/jodoh/page.tsx`

**Interfaces:**
- Consumes:
  - dari Task 1: `getWeton(dateStr: string): Weton`, `getKategoriNama(neptuA: number, neptuB: number): (typeof KATEGORI_ORDER)[number]` — import dari `@/lib/weton`
  - dari Task 2: default export array kategori — import dari `@/data/jodoh.json`
- Produces:
  - `export type JodohReading = { namaA: string; namaB: string; wetonA: Weton; wetonB: Weton; kategori: JodohKategori; deskripsi: string; saran: string }` — dipakai Task 4 (`JodohResult.tsx`) via `import type { JodohReading } from '@/app/jodoh/page'`
  - Default export `JodohPage` component yang me-render `<JodohResult data={result} />` (komponen dari Task 4 — untuk task ini, import saja `@/components/JodohResult`, filenya akan ada setelah Task 4 selesai)

- [ ] **Step 1: Tulis `src/app/jodoh/layout.tsx`**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Kecocokan Weton",
  description: "Cek kecocokan weton dan jodoh berdasarkan primbon Jawa. Masukkan tanggal lahir kalian berdua dan lihat hasilnya.",
};

export default function JodohLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 2: Tulis `src/app/jodoh/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import JodohResult from '@/components/JodohResult';
import jodohData from '@/data/jodoh.json';
import { getWeton, getKategoriNama, type Weton } from '@/lib/weton';

type JodohKategori = typeof jodohData[0];

const generateHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export type JodohReading = {
  namaA: string;
  namaB: string;
  wetonA: Weton;
  wetonB: Weton;
  kategori: JodohKategori;
  deskripsi: string;
  saran: string;
};

export default function JodohPage() {
  const [namaA, setNamaA] = useState('');
  const [tanggalA, setTanggalA] = useState('');
  const [namaB, setNamaB] = useState('');
  const [tanggalB, setTanggalB] = useState('');
  const [result, setResult] = useState<JodohReading | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingText, setLoadingText] = useState('Membaca petung jodoh...');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaA.trim() || !tanggalA || !namaB.trim() || !tanggalB) return;

    setIsAnimating(true);
    setResult(null);

    const ritualSteps = [
      'Membaca petung jodoh...',
      'Menghitung neptu berdua...',
      'Menyelaraskan weton kalian...',
      'Menimbang hari dan pasaran...',
      'Membuka lontar primbon...',
      'Merangkai hasil petungan...',
    ];

    let step = 0;
    setLoadingText(ritualSteps[step]);
    const interval = setInterval(() => {
      step++;
      if (step < ritualSteps.length) setLoadingText(ritualSteps[step]);
    }, 1300);

    setTimeout(() => {
      clearInterval(interval);

      const wetonA = getWeton(tanggalA);
      const wetonB = getWeton(tanggalB);
      const kategoriNama = getKategoriNama(wetonA.neptu, wetonB.neptu);
      const kategori = jodohData.find((k) => k.nama === kategoriNama) as JodohKategori;

      const base = namaA.trim().toLowerCase() + tanggalA + namaB.trim().toLowerCase() + tanggalB;
      const deskripsi = kategori.deskripsi[generateHash(base + 'd') % kategori.deskripsi.length];
      const saran = kategori.saran[generateHash(base + 's') % kategori.saran.length];

      setResult({
        namaA: namaA.trim(),
        namaB: namaB.trim(),
        wetonA,
        wetonB,
        kategori,
        deskripsi,
        saran,
      });
      setIsAnimating(false);
    }, 1300 * ritualSteps.length);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-950 font-sans text-slate-200">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-700/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[35%] right-[15%] w-[400px] h-[150px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 w-full max-w-lg flex flex-col gap-8">
        <div className="text-center space-y-4">
          <div className="inline-block border border-fuchsia-500/30 rounded-full px-4 py-1.5 mb-2 bg-fuchsia-500/10 backdrop-blur-sm text-fuchsia-300 text-xs font-semibold tracking-wider">
            💞 PETUNG JODOH PRIMBON JAWA
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-fuchsia-300 via-pink-300 to-rose-300 drop-shadow-lg pb-1">
            CEK WETON
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-sm mx-auto">
            Masukkan nama dan tanggal lahir kalian berdua, biar primbon yang bicara soal kecocokan.
          </p>
        </div>

        <form onSubmit={handleCheck} className="flex flex-col gap-5 mt-4">
          <div className={`flex flex-col gap-4 ${isAnimating ? 'hidden' : 'flex'}`}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex flex-col gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-inner">
                <p className="text-fuchsia-300 text-xs font-bold uppercase tracking-wider">Orang Pertama</p>
                <input
                  type="text"
                  value={namaA}
                  onChange={(e) => setNamaA(e.target.value)}
                  placeholder="Nama Orang Pertama..."
                  className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-medium"
                  required
                  autoComplete="off"
                  spellCheck="false"
                />
                <input
                  type="date"
                  value={tanggalA}
                  onChange={(e) => setTanggalA(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min="1900-01-01"
                  className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-medium [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex flex-col gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-inner">
                <p className="text-pink-300 text-xs font-bold uppercase tracking-wider">Orang Kedua</p>
                <input
                  type="text"
                  value={namaB}
                  onChange={(e) => setNamaB(e.target.value)}
                  placeholder="Nama Orang Kedua..."
                  className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-medium"
                  required
                  autoComplete="off"
                  spellCheck="false"
                />
                <input
                  type="date"
                  value={tanggalB}
                  onChange={(e) => setTanggalB(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min="1900-01-01"
                  className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-medium [color-scheme:dark]"
                  required
                />
              </div>
            </div>
          </div>

          {isAnimating ? (
            <div className="flex flex-col items-center justify-center p-8 gap-6 animate-in fade-in zoom-in duration-500">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_8s_linear_infinite]" />
                <div className="absolute inset-6 rounded-full border border-fuchsia-500/30 animate-[spin_4s_linear_infinite_reverse]" />
                <span className="text-4xl z-10 animate-pulse">💞</span>
              </div>
              <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400 animate-pulse text-center">
                {loadingText}
              </span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!namaA.trim() || !tanggalA || !namaB.trim() || !tanggalB}
              className="group relative w-full flex justify-center py-5 px-4 border border-white/10 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 focus:outline-none shadow-lg shadow-fuchsia-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />
              <span className="relative z-10 tracking-wide">💞 Cek Kecocokan</span>
            </button>
          )}
        </form>

        <div
          className={`transition-all duration-700 ease-out ${
            result && !isAnimating
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
          }`}
        >
          {result && !isAnimating && <JodohResult data={result} />}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(50%); } }
      `}} />
    </main>
  );
}
```

Catatan: file ini meng-import `@/components/JodohResult`, yang baru dibuat di Task 4. Ini normal untuk task ini — `tsc --noEmit` di Step 3 akan gagal sampai Task 4 selesai, itu diharapkan (lihat Step 3).

- [ ] **Step 3: Typecheck (boleh gagal karena Task 4 belum ada — pastikan error HANYA soal modul hilang)**

Run: `npx tsc --noEmit`
Expected: satu-satunya error terkait adalah `Cannot find module '@/components/JodohResult'` (atau serupa). Tidak boleh ada error lain di `src/app/jodoh/page.tsx` atau `layout.tsx` (mis. salah nama properti, salah tipe).

- [ ] **Step 4: Commit**

```bash
git add src/app/jodoh/layout.tsx src/app/jodoh/page.tsx
git commit -m "feat: add jodoh compatibility page"
```

---

### Task 4: Komponen hasil (`src/components/JodohResult.tsx`)

**Files:**
- Create: `src/components/JodohResult.tsx`

**Interfaces:**
- Consumes: `import type { JodohReading } from '@/app/jodoh/page'` (Task 3)
- Produces: default export `JodohResult({ data }: { data: JodohReading })` React component — dikonsumsi oleh `src/app/jodoh/page.tsx` (Task 3, sudah menulis importnya)

- [ ] **Step 1: Tulis `src/components/JodohResult.tsx`**

```tsx
'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import type { JodohReading } from '@/app/jodoh/page';

export default function JodohResult({ data }: { data: JodohReading }) {
  const resultRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareText, setShareText] = useState('Bagikan Hasil');

  const { kategori, wetonA, wetonB, namaA, namaB, deskripsi, saran } = data;
  const totalNeptu = wetonA.neptu + wetonB.neptu;

  const handleShare = async () => {
    if (!resultRef.current) return;
    setIsSharing(true);
    setShareText('Memproses...');
    try {
      const dataUrl = await toPng(resultRef.current, {
        quality: 1.0,
        backgroundColor: '#020617',
        pixelRatio: 2,
      });
      const caption = `Weton ${namaA} & ${namaB}: ${kategori.nama} (${kategori.arti}) ${kategori.emoji}\n\nCek kecocokan wetonmu: https://cek-race.vercel.app/jodoh`;

      try {
        const file = await fetch(dataUrl).then((r) => r.blob()).then((b) => new File([b], 'jodoh.png', { type: 'image/png' }));
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: `Weton ${kategori.nama}`, text: caption, files: [file] });
          setShareText('Berhasil Dibagikan!');
        } else throw new Error('no file share');
      } catch {
        const a = document.createElement('a');
        a.download = 'jodoh.png';
        a.href = dataUrl;
        a.click();
        try {
          await navigator.clipboard.writeText(caption);
          setShareText('Gambar Disimpan & Teks Disalin!');
        } catch {
          setShareText('Gambar Disimpan!');
        }
      }
    } catch (err) {
      console.error(err);
      setShareText('Gagal Membagikan');
    } finally {
      setTimeout(() => {
        setIsSharing(false);
        setShareText('Bagikan Hasil');
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6 w-full">
      <div ref={resultRef} className="w-full bg-transparent">
        <div
          className="relative w-full rounded-2xl bg-slate-900 border p-5 shadow-2xl overflow-hidden"
          style={{ borderColor: `${kategori.warna}40`, boxShadow: `0 20px 60px -15px ${kategori.warna}25` }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${kategori.warna}, transparent)` }}
          />

          <div className="relative z-10 flex flex-col items-center gap-2 mb-5 text-center">
            <span className="text-5xl" style={{ filter: `drop-shadow(0 0 10px ${kategori.warna})` }}>
              {kategori.emoji}
            </span>
            <h2
              className="text-4xl font-black tracking-tight"
              style={{ color: kategori.warna, textShadow: `0 0 20px ${kategori.warna}60` }}
            >
              {kategori.nama}
            </h2>
            <p className="text-slate-400 text-sm font-medium">{kategori.arti}</p>
            <p className="text-slate-500 text-xs mt-1">
              {namaA} &amp; {namaB}
            </p>
          </div>

          <div
            className="relative z-10 rounded-xl border p-4 mb-3"
            style={{ borderColor: `${kategori.warna}30`, background: `${kategori.warna}0d` }}
          >
            <p className="text-slate-300 text-sm leading-relaxed">{deskripsi}</p>
          </div>

          <div className="relative z-10 rounded-xl border border-white/10 bg-white/5 p-4 mb-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">💡 Saran</p>
            <p className="text-slate-300 text-sm leading-relaxed">{saran}</p>
          </div>

          <div
            className="relative z-10 h-px my-3"
            style={{ background: `linear-gradient(90deg, transparent, ${kategori.warna}40, transparent)` }}
          />

          <p className="relative z-10 text-slate-400 uppercase tracking-widest text-xs font-semibold text-center mb-3">
            Rincian Weton
          </p>
          <div className="relative z-10 grid grid-cols-2 gap-3 mb-3">
            {[
              { nama: namaA, weton: wetonA },
              { nama: namaB, weton: wetonB },
            ].map((p, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-slate-200 font-bold text-sm truncate">{p.nama}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {p.weton.hari} {p.weton.pasaran}
                </p>
                <p className="text-xs mt-1" style={{ color: kategori.warna }}>
                  Neptu: {p.weton.neptu}
                </p>
              </div>
            ))}
          </div>
          <div className="relative z-10 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Neptu Gabungan</p>
            <p className="font-bold text-lg" style={{ color: kategori.warna }}>
              {totalNeptu}
            </p>
          </div>

          <div className="relative z-10 mt-4 text-center">
            <span className="text-xs text-slate-500 font-medium tracking-widest uppercase">✦ 100% Tidak Ilmiah ✦</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleShare}
        disabled={isSharing}
        className="w-full py-4 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold flex items-center justify-center gap-3 transition-all outline-none focus:ring-2 focus:ring-fuchsia-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSharing && shareText === 'Memproses...' ? (
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : shareText.includes('Berhasil') || shareText.includes('Disimpan') ? (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        )}
        {shareText}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck penuh (Task 3 + Task 4 sekarang lengkap)**

Run: `npx tsc --noEmit`
Expected: tidak ada error sama sekali.

- [ ] **Step 3: Commit**

```bash
git add src/components/JodohResult.tsx
git commit -m "feat: add jodoh result display component"
```

---

### Task 5: Tambah tab navigasi (`src/components/BottomNav.tsx`)

**Files:**
- Modify: `src/components/BottomNav.tsx:1-53` (import icon + array `TABS`)

**Interfaces:**
- Consumes: tidak ada dari task lain — hanya menambah entri navigasi ke route `/jodoh` yang sudah ada dari Task 3
- Produces: tidak ada (task terakhir yang mengonsumsi hasil task lain)

- [ ] **Step 1: Tambah import `HeartHandshake`**

Di `src/components/BottomNav.tsx:5`, ubah:

```tsx
import { Sparkles, Activity, Star, Moon, Heart } from 'lucide-react';
```

menjadi:

```tsx
import { Sparkles, Activity, Star, Moon, Heart, HeartHandshake } from 'lucide-react';
```

- [ ] **Step 2: Tambah entri tab "Jodoh" setelah tab Zodiak, sebelum tab Donasi**

Di `src/components/BottomNav.tsx`, cari blok tab Zodiak (baris 35–43):

```tsx
  {
    href: '/zodiak',
    label: 'Zodiak',
    icon: Moon,
    color: 'text-cyan-400',
    dot: 'bg-cyan-400',
    activeBg: 'bg-cyan-500/15',
    activeBorder: 'border-cyan-500/30',
  },
```

Tambahkan blok baru tepat setelahnya (sebelum blok tab Donasi):

```tsx
  {
    href: '/jodoh',
    label: 'Jodoh',
    icon: HeartHandshake,
    color: 'text-fuchsia-400',
    dot: 'bg-fuchsia-400',
    activeBg: 'bg-fuchsia-500/15',
    activeBorder: 'border-fuchsia-500/30',
  },
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: tidak ada error.

- [ ] **Step 4: Commit**

```bash
git add src/components/BottomNav.tsx
git commit -m "feat: add jodoh tab to bottom navigation"
```

---

### Task 6: Verifikasi build akhir

**Files:** tidak ada file baru/diubah — task ini murni verifikasi integrasi seluruh task di atas.

**Interfaces:**
- Consumes: seluruh output Task 1–5
- Produces: tidak ada (task terakhir)

- [ ] **Step 1: Lint**

Run: `yarn lint`
Expected: tidak ada error (warning boleh ada kalau sudah ada sebelumnya di file lain, tapi tidak boleh ada error baru di file yang dibuat/diubah task ini: `src/lib/weton.ts`, `src/data/jodoh.json`, `src/app/jodoh/layout.tsx`, `src/app/jodoh/page.tsx`, `src/components/JodohResult.tsx`, `src/components/BottomNav.tsx`).

- [ ] **Step 2: Build produksi**

Run: `yarn build`
Expected: build sukses, dan output build listing menampilkan route `/jodoh` sebagai static/prerendered page (mirip `/zodiak`, `/tarot`, dll).

- [ ] **Step 3: Serahkan ke user untuk uji manual**

Tidak perlu langkah otomatis lagi di sini — user sudah menyatakan ingin menguji fitur ini secara manual (`yarn dev` lalu buka `/jodoh` di browser). Tidak ada commit di step ini.
