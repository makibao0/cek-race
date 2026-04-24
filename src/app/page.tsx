'use client';

import { useState } from 'react';
import RaceResult from '@/components/RaceResult';
import allRacesData from '@/data/races.json';
import dynamic from 'next/dynamic';

const COMPLETED_RACES = [
  "Jin", "Siluman", "Khodam Macan Putih", "Alien", "Kuntilanak",
  "Manusia", "Peri", "Bidadari", "Susuk", "Lelembut",
  "Pocong", "Tuyul", "Genderuwo", "Dewa", "Zombie",
  "Begu Ganjang", "Vampir", "Kolong Wewe", "Lord", "Monster",
  "Dukun", "Mutant", "Elf", "Khodam", "Wewe Gombel",
  "Pendekar", "Bangjago", "Palasik", "Suanggi", "Orc",
  "Sepuh", "Jelangkung", "Demit", "Arwah", "Druid",
  "Nyi Roro", "Biksu", "Cyborg", "Malaikat", "Babi Ngepet",
  "Troll", "Leak", "Jenglot", "Gondoruwo", "Suhu", "Goblin",
  "Penyihir", "Entitas", "Banaspati", "Kuyang", "Merman",
  "Mpu", "Naga", "Orang Bunian"
];
const racesData = allRacesData.filter((item: any) => COMPLETED_RACES.includes(item.ras));
import dukunAnimation from '../../public/magic.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function Home() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<null | { ras: string, profesi: string, deskripsi: string }>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingText, setLoadingText] = useState('Membaca aura...');

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

    // Simulate reading aura / calling khodam magic
    const ritualSteps = [
      "Membaca aura...",
      "Menyelaraskan cakra batin...",
      "Menarik energi alam sekitar...",
      "Memanggil saksi gaib...",
      "Bernegosiasi dengan leluhur...",
      "Membuka portal astral..."
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

      const raceIndex = hash % racesData.length;
      const selectedRace = racesData[raceIndex];

      const profIndex = hash % selectedRace.profesi.length;
      const selectedProfesi = selectedRace.profesi[profIndex];

      setResult({
        ras: selectedRace.ras,
        profesi: selectedProfesi,
        deskripsi: selectedRace.deskripsi
      });
      setIsAnimating(false);
    }, 1500 * ritualSteps.length);
  };


  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-950 font-sans text-slate-200">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[800px] h-[100px] bg-indigo-600/10 rounded-full blur-[100px] rotate-45 pointer-events-none" />

      <div className="z-10 w-full max-w-lg flex flex-col gap-8">
        <div className="text-center space-y-4">
          <div className="inline-block border border-purple-500/30 rounded-full px-4 py-1.5 mb-2 bg-purple-500/10 backdrop-blur-sm text-purple-300 text-xs font-semibold tracking-wider">
            🔮 100% TIDAK ILMIAH
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 drop-shadow-lg pb-1">
            CEK RAS & KHODAM
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-sm mx-auto">
            Temukan jati diri, ras, dan profesi sejati yang tersembunyi di dalam namamu.
          </p>
        </div>

        <form onSubmit={handleCheck} className="flex flex-col gap-5 mt-4">
          <div className={`relative group ${isAnimating ? 'hidden' : 'block'}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan Nama Lengkapmu..."
              className="relative w-full bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl px-6 py-5 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium shadow-inner"
              required
              autoComplete="off" spellCheck="false"
            />
          </div>

          {isAnimating ? (
            <div className="flex flex-col items-center justify-center p-8 gap-4 animate-in fade-in zoom-in duration-500">
              <div className="w-40 h-40 relative flex items-center justify-center">
                <Lottie animationData={dukunAnimation} loop={true} className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              </div>
              <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse text-center">
                {loadingText}
              </span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!name.trim()}
              className="group relative w-full flex justify-center py-5 px-4 border border-white/10 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 focus:outline-none shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />

              <span className="relative z-10 tracking-wide text-shadow-sm">Cek Sekarang</span>
            </button>
          )}
        </form>

        <div className={`transition-all duration-700 ease-out ${result && !isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
          {result && !isAnimating && (
            <RaceResult data={result} name={name.trim()} />
          )}
        </div>
      </div>

      {/* Required for the shimmer animation to work correctly without config */}
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
