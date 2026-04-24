'use client';

import { useState } from 'react';
import AuraResult from '@/components/AuraResult';
import auraData from '@/data/aura.json';
import dynamic from 'next/dynamic';
import magicAnimation from '../../../public/magic.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function AuraPage() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<null | { warna: string, hex: string, sifat: string, deskripsi: string }>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingText, setLoadingText] = useState('Mendeteksi gelombang energi...');

  // Hash function to make results consistent for the same name
  const generateHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsAnimating(true);
    setResult(null);

    const ritualSteps = [
      "Mendeteksi gelombang energi...",
      "Mengkalibrasi frekuensi cakra...",
      "Menyelaraskan spektrum cahaya batin...",
      "Membaca resonansi emosional...",
      "Mengekstrak pigmen astral...",
      "Mewujudkan warna aura sejati..."
    ];
    let step = 0;
    setLoadingText(ritualSteps[step]);

    const interval = setInterval(() => {
      step++;
      if (step < ritualSteps.length) {
        setLoadingText(ritualSteps[step]);
      }
    }, 1500);

    setTimeout(() => {
      clearInterval(interval);
      const sanitizedName = name.trim().toLowerCase();
      const hash = generateHash(sanitizedName);

      const raceIndex = hash % auraData.length;
      const selectedAura = auraData[raceIndex];

      setResult({
        warna: selectedAura.warna,
        hex: selectedAura.hex,
        sifat: selectedAura.sifat,
        deskripsi: selectedAura.deskripsi
      });
      setIsAnimating(false);
    }, 1500 * ritualSteps.length);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-950 font-sans text-slate-200">
      {/* Background decorations - slightly different colors for Aura page */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[800px] h-[100px] bg-fuchsia-600/10 rounded-full blur-[100px] rotate-45 pointer-events-none" />

      <div className="z-10 w-full max-w-lg flex flex-col gap-8">
        <div className="text-center space-y-4">
          <div className="inline-block border border-pink-500/30 rounded-full px-4 py-1.5 mb-2 bg-pink-500/10 backdrop-blur-sm text-pink-300 text-xs font-semibold tracking-wider">
            ✨ SPEKTRUM ENERGI
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-pink-300 via-purple-300 to-cyan-300 drop-shadow-lg pb-1">
            CEK WARNA AURA
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-sm mx-auto">
            Singkap warna auramu yang sebenarnya dan ketahui apa maknanya.
          </p>
        </div>

        <form onSubmit={handleCheck} className="flex flex-col gap-5 mt-4">
          <div className={`relative group ${isAnimating ? 'hidden' : 'block'}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan Nama Lengkapmu..."
              className="relative w-full bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl px-6 py-5 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-medium shadow-inner"
              required
              autoComplete="off" spellCheck="false"
            />
          </div>

          {isAnimating ? (
            <div className="flex flex-col items-center justify-center p-8 gap-4 animate-in fade-in zoom-in duration-500">
              <div className="w-40 h-40 relative flex items-center justify-center filter hue-rotate-90">
                <Lottie animationData={magicAnimation} loop={true} className="w-full h-full drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
              </div>
              <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 animate-pulse text-center">
                {loadingText}
              </span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!name.trim()}
              className="group relative w-full flex justify-center py-5 px-4 border border-white/10 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 focus:outline-none shadow-lg shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />
              <span className="relative z-10 tracking-wide text-shadow-sm">Lihat Auraku</span>
            </button>
          )}
        </form>

        <div className={`transition-all duration-700 ease-out ${result && !isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
          {result && !isAnimating && (
            <AuraResult data={result} name={name.trim()} />
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% {
            transform: translateX(50%);
          }
        }
      `}} />
    </main>
  );
}
