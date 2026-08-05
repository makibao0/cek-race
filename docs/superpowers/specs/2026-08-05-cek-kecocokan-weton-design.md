# Desain: Cek Kecocokan Weton

**Tanggal**: 2026-08-05
**Status**: Disetujui, siap masuk tahap perencanaan implementasi

## Latar Belakang

"Cek Ras" adalah aplikasi hiburan (100% tidak ilmiah) dengan fitur-fitur bertema
mistis/tradisional: Cek Ras, Aura, Tarot, Zodiak. Setiap fitur mengikuti pola yang
sama: halaman dengan form input, animasi loading bertema "ritual", lalu kartu hasil
yang bisa dibagikan sebagai gambar.

Fitur baru ini menambahkan **Cek Kecocokan Weton** — dua orang memasukkan nama dan
tanggal lahir, aplikasi menghitung weton (hari + pasaran) masing-masing lalu
menentukan kategori kecocokan jodoh berdasarkan metode "Petung Jodoh" dalam primbon
Jawa.

## Rute & Navigasi

- Halaman baru: `src/app/jodoh/page.tsx` + `src/app/jodoh/layout.tsx` (metadata),
  mengikuti pola persis `src/app/zodiak/`.
- Tab baru di `src/components/BottomNav.tsx`:
  - `href: '/jodoh'`, `label: 'Jodoh'`
  - Ikon: `HeartHandshake` dari `lucide-react` (sudah dikonfirmasi tersedia di versi
    yang terpasang)
  - Skema warna: fuchsia (`text-fuchsia-400`, `bg-fuchsia-400` untuk dot,
    `bg-fuchsia-500/15` activeBg, `border-fuchsia-500/30` activeBorder) — dipilih
    karena berbeda dari aksen rose yang sudah dipakai tab Donasi.

## Algoritma Perhitungan

Tidak ada dependency baru — murni kalkulasi tanggal di JS, sama seperti cara Zodiak
menentukan rasi dari tanggal mentah.

### 1. Hari (hari dalam seminggu)

Langsung dari `Date.getDay()` pada tanggal lahir (0 = Minggu ... 6 = Sabtu). Tidak
perlu tabel acuan karena kalender Gregorian JS sudah akurat untuk ini.

### 2. Pasaran (siklus 5 hari)

Dihitung dari selisih hari terhadap tanggal acuan yang sudah dikenal luas dalam
budaya Indonesia:

- **Acuan**: 17 Agustus 1945 = **Jumat Legi** (hari kemerdekaan RI, weton-nya sering
  dikutip dan mudah diverifikasi).
- `diffDays = floor((tanggalLahir - acuan) / 86400000)`
- `pasaranIndex = ((diffDays % 5) + 5) % 5` (agar hasil selalu positif untuk tanggal
  sebelum acuan)
- `pasaranNames = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon']` (index 0 = Legi,
  cocok dengan acuan)

### 3. Neptu (nilai numerik)

Tabel neptu standar primbon Jawa:

| Hari    | Neptu |
|---------|-------|
| Minggu  | 5     |
| Senin   | 4     |
| Selasa  | 3     |
| Rabu    | 7     |
| Kamis   | 8     |
| Jumat   | 6     |
| Sabtu   | 9     |

| Pasaran | Neptu |
|---------|-------|
| Legi    | 5     |
| Pahing  | 9     |
| Pon     | 7     |
| Wage    | 4     |
| Kliwon  | 8     |

Neptu weton seseorang = neptu hari + neptu pasaran.

### 4. Kategori kecocokan ("Petung Jodoh")

```
total = neptuA + neptuB
sisa = total % 8
kategoriIndex = sisa === 0 ? 8 : sisa   // sisa 0 dianggap kelipatan 8 (Pesthi)
```

Pemetaan sisa → kategori (urutan standar primbon):

1. **Pegat** — cerai / banyak masalah besar
2. **Ratu** — rukun, saling menghormati, disegani
3. **Jodoh** — cocok, berjodoh, saling melengkapi
4. **Topo** — banyak ujian di awal, berbuah manis di akhir
5. **Tinari** — mudah rezeki, kehidupan berkecukupan
6. **Padu** — sering bertengkar kecil, tapi tidak sampai bercerai
7. **Sujanan** — rawan godaan/perselingkuhan, masalah finansial
8. **Pesthi** — rukun dan harmonis sampai tua

## Struktur Data (`src/data/jodoh.json`)

Array berisi 8 objek kategori:

```json
{
  "nama": "Pesthi",
  "arti": "Rukun & Harmonis",
  "emoji": "🕊️",
  "warna": "#a78bfa",
  "deskripsi": ["...variasi teks 1...", "...variasi teks 2...", "..."],
  "saran": ["...variasi saran 1...", "...variasi saran 2...", "..."]
}
```

- `deskripsi` dan `saran` masing-masing berisi 4–6 variasi teks.
- Variasi dipilih lewat fungsi hash yang sudah dipakai di halaman lain
  (`generateHash`), di-seed dari gabungan nama A + nama B + tanggal lahir A +
  tanggal lahir B. Ini membuat hasil deterministik (cek ulang pasangan yang sama
  selalu dapat variasi teks yang sama), tapi pasangan lain dengan nama/tanggal
  berbeda yang kebetulan jatuh di kategori sama akan melihat variasi teks yang
  berbeda.

## Alur UI

### `src/app/jodoh/page.tsx`

- Form input:
  - Nama Orang A + Tanggal Lahir A
  - Nama Orang B + Tanggal Lahir B
- State & flow mengikuti pola `zodiak/page.tsx`: `isAnimating`, `loadingText` dengan
  langkah-langkah "ritual" bertema perjodohan (mis. "Membaca petung jodoh...",
  "Menghitung neptu berdua...", "Menyelaraskan weton...", dst), lalu `result`.
- Setelah animasi selesai, hitung weton A, weton B, kategori, dan render
  `JodohResult`.

### `src/components/JodohResult.tsx`

- Kartu hasil berisi:
  - Nama kategori besar + arti singkat (mis. "Pesthi — Rukun & Harmonis")
  - Deskripsi (variasi terpilih)
  - Saran (variasi terpilih)
  - Rincian weton per orang (nama, tanggal lahir, hari, pasaran, neptu) ditampilkan
    seperti "struk" perhitungan, plus total neptu gabungan — sesuai pola detail di
    Zodiak.
- Tombol bagikan hasil sebagai gambar via `html-to-image` (`toPng`), sama seperti
  `ZodiakResult.tsx` — termasuk fallback download + copy caption bila Web Share API
  tidak tersedia.

## Di luar cakupan

- Tidak ada test otomatis ditambahkan — user akan menguji secara manual di browser.
- Tidak menambah dependency baru (tanpa library kalender Jawa eksternal).
- Tidak mengubah fitur/halaman yang sudah ada selain menambah satu entri di
  `BottomNav.tsx`.
