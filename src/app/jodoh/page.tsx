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
