'use client';

import { useState } from 'react';
import ZodiakResult from '@/components/ZodiakResult';
import zodiacData from '@/data/zodiak.json';

type ZodiacSign = typeof zodiacData[0];

const getZodiacSign = (month: number, day: number): ZodiacSign | null => {
  const d = month * 100 + day;
  if (d >= 1221 || d <= 119) return zodiacData.find(z => z.nama === 'Capricorn') ?? null;
  if (d >= 120 && d <= 218) return zodiacData.find(z => z.nama === 'Aquarius') ?? null;
  if (d >= 219 && d <= 320) return zodiacData.find(z => z.nama === 'Pisces') ?? null;
  if (d >= 321 && d <= 419) return zodiacData.find(z => z.nama === 'Aries') ?? null;
  if (d >= 420 && d <= 520) return zodiacData.find(z => z.nama === 'Taurus') ?? null;
  if (d >= 521 && d <= 620) return zodiacData.find(z => z.nama === 'Gemini') ?? null;
  if (d >= 621 && d <= 722) return zodiacData.find(z => z.nama === 'Cancer') ?? null;
  if (d >= 723 && d <= 822) return zodiacData.find(z => z.nama === 'Leo') ?? null;
  if (d >= 823 && d <= 922) return zodiacData.find(z => z.nama === 'Virgo') ?? null;
  if (d >= 923 && d <= 1022) return zodiacData.find(z => z.nama === 'Libra') ?? null;
  if (d >= 1023 && d <= 1121) return zodiacData.find(z => z.nama === 'Scorpio') ?? null;
  if (d >= 1122 && d <= 1220) return zodiacData.find(z => z.nama === 'Sagittarius') ?? null;
  return null;
};

const generateHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export type ZodiakReading = {
  sign: ZodiacSign;
  karir: string;
  asmara: string;
  finansial: string;
  kesehatan: string;
  birthDate: string;
};

export default function ZodiakPage() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<ZodiakReading | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingText, setLoadingText] = useState('Membaca bintang...');
  const [error, setError] = useState('');

  const handleCheck = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    const [, month, day] = birthDate.split('-').map(Number);
    const sign = getZodiacSign(month, day);

    if (!sign) {
      setError('Tanggal tidak valid. Coba lagi.');
      return;
    }
    setError('');
    setIsAnimating(true);
    setResult(null);

    const ritualSteps = [
      'Membaca konstelasi bintangmu...',
      'Menyelaraskan planet dan zodiak...',
      'Menghitung posisi langit saat lahirmu...',
      'Membuka gulungan nasib kosmik...',
      'Mengekstrak ramalan dari eter...',
      'Menyusun pesan dari semesta...',
    ];

    let step = 0;
    setLoadingText(ritualSteps[step]);
    const interval = setInterval(() => {
      step++;
      if (step < ritualSteps.length) setLoadingText(ritualSteps[step]);
    }, 1300);

    setTimeout(() => {
      clearInterval(interval);
      const today = new Date().toISOString().split('T')[0];
      const base = birthDate + sign.nama + today;

      const reading: ZodiakReading = {
        sign,
        karir: sign.karir[generateHash(base + 'k') % sign.karir.length],
        asmara: sign.asmara[generateHash(base + 'a') % sign.asmara.length],
        finansial: sign.finansial[generateHash(base + 'f') % sign.finansial.length],
        kesehatan: sign.kesehatan[generateHash(base + 'kes') % sign.kesehatan.length],
        birthDate,
      };

      setResult(reading);
      setIsAnimating(false);
    }, 1300 * ritualSteps.length);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-950 font-sans text-slate-200">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-700/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[400px] h-[150px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Twinkling stars background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-[twinkle_linear_infinite]"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="z-10 w-full max-w-lg flex flex-col gap-8">
        <div className="text-center space-y-4">
          <div className="inline-block border border-cyan-500/30 rounded-full px-4 py-1.5 mb-2 bg-cyan-500/10 backdrop-blur-sm text-cyan-300 text-xs font-semibold tracking-wider">
            🌙 RAMALAN BINTANG HARIANMU
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 via-indigo-300 to-violet-300 drop-shadow-lg pb-1">
            CEK ZODIAK
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-sm mx-auto">
            Masukkan tanggal lahirmu dan biarkan bintang-bintang berbicara tentang nasibmu.
          </p>
        </div>

        <form onSubmit={handleCheck} className="flex flex-col gap-5 mt-4">
          <div className={`relative group ${isAnimating ? 'hidden' : 'block'}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative flex flex-col gap-1">
              <label className="text-slate-400 text-sm font-medium px-1">Tanggal Lahirmu</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min="1900-01-01"
                className="relative w-full bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl px-6 py-5 text-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium shadow-inner [color-scheme:dark]"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {isAnimating ? (
            <div className="flex flex-col items-center justify-center p-8 gap-6 animate-in fade-in zoom-in duration-500">
              {/* Constellation animation */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_8s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_5s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full border border-cyan-500/30 animate-[spin_3s_linear_infinite]" />

                {/* Stars on the orbit */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_6px_2px_rgba(34,211,238,0.6)] animate-[spin_8s_linear_infinite]"
                    style={{
                      top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 6)}%`,
                      left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 6)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}

                <span className="text-4xl z-10 animate-[pulseStar_2s_ease-in-out_infinite]">✨</span>
              </div>

              <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 animate-pulse text-center">
                {loadingText}
              </span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!birthDate}
              className="group relative w-full flex justify-center py-5 px-4 border border-white/10 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 focus:outline-none shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />
              <span className="relative z-10 tracking-wide">🌙 Baca Zodiakku</span>
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
          {result && !isAnimating && <ZodiakResult data={result} />}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(50%); } }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes pulseStar {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
        }
      `}} />
    </main>
  );
}
