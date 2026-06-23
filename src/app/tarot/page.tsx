'use client';

import { useState } from 'react';
import TarotResult from '@/components/TarotResult';
import tarotData from '@/data/tarot.json';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const generateHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export type DrawnCard = {
  card: typeof tarotData[0];
  isReversed: boolean;
  position: string;
};

export default function TarotPage() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<DrawnCard[] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingText, setLoadingText] = useState('Mengocok kartu...');

  const handleRead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsAnimating(true);
    setResult(null);

    const ritualSteps = [
      'Mengocok kartu nasib...',
      'Membuka tirai semesta...',
      'Memanggil energi astral...',
      'Menarik tiga kartu untukmu...',
      'Menafsirkan pesan kartu...',
      'Membaca benang takdirmu...',
    ];

    let step = 0;
    setLoadingText(ritualSteps[step]);
    const interval = setInterval(() => {
      step++;
      if (step < ritualSteps.length) setLoadingText(ritualSteps[step]);
    }, 1400);

    setTimeout(() => {
      clearInterval(interval);
      const sanitized = name.trim().toLowerCase();

      const h1 = generateHash(sanitized + '_past');
      const h2 = generateHash(sanitized + '_present');
      const h3 = generateHash(sanitized + '_future');

      let i1 = h1 % tarotData.length;
      let i2 = h2 % tarotData.length;
      let i3 = h3 % tarotData.length;

      if (i2 === i1) i2 = (i2 + 1) % tarotData.length;
      if (i3 === i1) i3 = (i3 + 2) % tarotData.length;
      if (i3 === i2) i3 = (i3 + 1) % tarotData.length;

      const drawn: DrawnCard[] = [
        { card: tarotData[i1], isReversed: h1 % 3 === 0, position: 'Masa Lalu' },
        { card: tarotData[i2], isReversed: h2 % 3 === 0, position: 'Masa Kini' },
        { card: tarotData[i3], isReversed: h3 % 3 === 0, position: 'Masa Depan' },
      ];

      setResult(drawn);
      setIsAnimating(false);
    }, 1400 * ritualSteps.length);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-950 font-sans text-slate-200">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-700/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[700px] h-[120px] bg-rose-600/10 rounded-full blur-[100px] rotate-45 pointer-events-none" />

      {/* Floating star particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40 animate-[floatStar_linear_infinite]"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 4}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="z-10 w-full max-w-lg flex flex-col gap-8">
        <div className="text-center space-y-4">
          <div className="inline-block border border-amber-500/30 rounded-full px-4 py-1.5 mb-2 bg-amber-500/10 backdrop-blur-sm text-amber-300 text-xs font-semibold tracking-wider">
            🃏 BACA NASIB DARI KARTU
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-amber-300 via-violet-300 to-rose-300 drop-shadow-lg pb-1">
            BACA TAROT
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-sm mx-auto">
            Tiga kartu akan dibacakan untukmu — masa lalu, masa kini, dan masa depanmu.
          </p>
        </div>

        <form onSubmit={handleRead} className="flex flex-col gap-5 mt-4">
          <div className={`relative group ${isAnimating ? 'hidden' : 'block'}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-violet-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan Nama Lengkapmu..."
              className="relative w-full bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl px-6 py-5 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium shadow-inner"
              required
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          {isAnimating ? (
            <div className="flex flex-col items-center justify-center p-8 gap-4 animate-in fade-in zoom-in duration-500">
              <div className="relative w-44 h-44">
                {/* 3 card silhouettes orbiting */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-20 rounded-lg bg-gradient-to-b from-violet-500/60 to-amber-500/60 border border-white/20 shadow-lg animate-[cardOrbit_3s_ease-in-out_infinite]" style={{ transformOrigin: '50% 150%' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-20 rounded-lg bg-gradient-to-b from-amber-500/60 to-rose-500/60 border border-white/20 shadow-lg animate-[cardOrbit_3s_ease-in-out_infinite_0.5s]" style={{ transformOrigin: '50% 150%' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-20 rounded-lg bg-gradient-to-b from-rose-500/60 to-violet-500/60 border border-white/20 shadow-lg animate-[cardOrbit_3s_ease-in-out_infinite_1s]" style={{ transformOrigin: '50% 150%' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl animate-pulse">🔮</span>
                </div>
              </div>
              <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-violet-400 animate-pulse text-center">
                {loadingText}
              </span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!name.trim()}
              className="group relative w-full flex justify-center py-5 px-4 border border-white/10 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-amber-600 to-violet-600 hover:from-amber-500 hover:to-violet-500 focus:outline-none shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />
              <span className="relative z-10 tracking-wide">✨ Buka Kartu Tarotku</span>
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
          {result && !isAnimating && <TarotResult cards={result} name={name.trim()} />}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(50%); } }
        @keyframes floatStar {
          0% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
          100% { transform: translateY(0px) scale(1); opacity: 0.4; }
        }
        @keyframes cardOrbit {
          0% { transform: rotate(0deg) translateY(-50px) rotate(0deg); }
          100% { transform: rotate(360deg) translateY(-50px) rotate(-360deg); }
        }
      `}} />
    </main>
  );
}
