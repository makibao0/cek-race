'use client';

import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import type { ZodiakReading } from '@/app/zodiak/page';

const ASPECTS = [
  { key: 'karir', label: 'Karir & Profesi', emoji: '💼', gradient: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30', text: 'text-blue-300' },
  { key: 'asmara', label: 'Asmara & Cinta', emoji: '💕', gradient: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/30', text: 'text-rose-300' },
  { key: 'finansial', label: 'Finansial & Rezeki', emoji: '💰', gradient: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30', text: 'text-amber-300' },
  { key: 'kesehatan', label: 'Kesehatan & Energi', emoji: '🌿', gradient: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', text: 'text-emerald-300' },
] as const;

export default function ZodiakResult({ data }: { data: ZodiakReading }) {
  const resultRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareText, setShareText] = useState('Bagikan Hasil');
  const [visibleAspects, setVisibleAspects] = useState(0);
  const [symbolAnimated, setSymbolAnimated] = useState(false);

  const { sign } = data;

  useEffect(() => {
    // Animate zodiac symbol first
    setTimeout(() => setSymbolAnimated(true), 200);
    // Then reveal aspect cards one by one
    ASPECTS.forEach((_, i) => {
      setTimeout(() => setVisibleAspects(i + 1), 600 + i * 350);
    });
  }, []);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${day} ${months[month - 1]} ${year}`;
  };

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
      const caption = `Zodiak aku ${sign.simbol} ${sign.nama} — ${sign.kepribadian}\n\nCek zodiakmu: https://cek-race.vercel.app/zodiak`;

      try {
        const file = await fetch(dataUrl).then(r => r.blob()).then(b => new File([b], 'zodiak.png', { type: 'image/png' }));
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: `Zodiak ${sign.nama}`, text: caption, files: [file] });
          setShareText('Berhasil Dibagikan!');
        } else throw new Error('no file share');
      } catch {
        const a = document.createElement('a');
        a.download = 'zodiak.png';
        a.href = dataUrl;
        a.click();
        try { await navigator.clipboard.writeText(caption); setShareText('Gambar Disimpan & Teks Disalin!'); }
        catch { setShareText('Gambar Disimpan!'); }
      }
    } catch (err) {
      console.error(err);
      setShareText('Gagal Membagikan');
    } finally {
      setTimeout(() => { setIsSharing(false); setShareText('Bagikan Hasil'); }, 3000);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6 w-full">
      <div ref={resultRef} className="w-full bg-transparent">
        <div
          className="relative w-full rounded-2xl bg-slate-900 border p-5 shadow-2xl overflow-hidden"
          style={{
            borderColor: `${sign.warna}40`,
            boxShadow: `0 20px 60px -15px ${sign.warna}25`,
          }}
        >
          {/* Animated top glow */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${sign.warna}, transparent)` }}
          />

          {/* Corner blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full blur-2xl opacity-20 pointer-events-none"
            style={{ backgroundColor: sign.warna }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 -ml-10 -mb-10 rounded-full blur-2xl opacity-20 pointer-events-none"
            style={{ backgroundColor: sign.warna }} />

          {/* Zodiac Symbol Hero */}
          <div
            className={`relative z-10 flex flex-col items-center gap-3 mb-6 transition-all duration-700 ${symbolAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          >
            {/* Big symbol with glow rings */}
            <div className="relative flex items-center justify-center">
              {/* Outer glow rings */}
              <div
                className="absolute w-32 h-32 rounded-full border animate-[ping_3s_ease-in-out_infinite] opacity-20"
                style={{ borderColor: sign.warna }}
              />
              <div
                className="absolute w-24 h-24 rounded-full border opacity-30 animate-[spin_10s_linear_infinite]"
                style={{ borderColor: sign.warna, borderStyle: 'dashed' }}
              />

              {/* Symbol circle */}
              <div
                className="relative w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-2xl"
                style={{
                  borderColor: sign.warna,
                  boxShadow: `0 0 30px 5px ${sign.warna}40, inset 0 0 20px ${sign.warna}20`,
                  background: `radial-gradient(circle, ${sign.warna}20 0%, transparent 70%)`,
                }}
              >
                <span className="text-5xl leading-none" style={{ filter: `drop-shadow(0 0 10px ${sign.warna})` }}>
                  {sign.simbol}
                </span>
              </div>
            </div>

            {/* Sign name & date */}
            <div className="text-center">
              <h2
                className="text-4xl font-black tracking-tight"
                style={{ color: sign.warna, textShadow: `0 0 20px ${sign.warna}60` }}
              >
                {sign.nama}
              </h2>
              <p className="text-slate-400 text-sm mt-1 font-medium">
                {sign.emoji} {sign.elemen} · {sign.ikon_elemen} · {sign.planet}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Lahir {formatDate(data.birthDate)}
              </p>
            </div>

            {/* Personality tag */}
            <div
              className="mt-1 text-center px-4 py-2 rounded-xl text-sm text-slate-200 italic leading-snug border max-w-xs"
              style={{ borderColor: `${sign.warna}30`, background: `${sign.warna}10` }}
            >
              "{sign.kepribadian}"
            </div>

            {/* Strength / Weakness chips */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-1">
              {sign.kekuatan.split(', ').map((k, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide"
                  style={{ borderColor: `${sign.warna}40`, color: sign.warna, backgroundColor: `${sign.warna}10` }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative z-10 h-px my-4" style={{ background: `linear-gradient(90deg, transparent, ${sign.warna}40, transparent)` }} />

          {/* Fortune Aspect Cards */}
          <div className="relative z-10 flex flex-col gap-3">
            <p className="text-slate-400 uppercase tracking-widest text-xs font-semibold text-center mb-1">
              Ramalan Hari Ini
            </p>
            {ASPECTS.map((aspect, i) => {
              const text = data[aspect.key as keyof typeof data] as string;
              const isVisible = visibleAspects > i;

              return (
                <div
                  key={aspect.key}
                  className={`rounded-xl border bg-gradient-to-r ${aspect.gradient} ${aspect.border} p-4 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{aspect.emoji}</span>
                    <p className={`font-bold text-sm ${aspect.text}`}>{aspect.label}</p>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>

          {/* Lucky section */}
          <div
            className={`relative z-10 mt-4 rounded-xl border p-4 transition-all duration-500 ${visibleAspects >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ borderColor: `${sign.warna}30`, background: `${sign.warna}08` }}
          >
            <p className="text-slate-400 uppercase tracking-widest text-xs font-semibold text-center mb-3">
              ✨ Info Keberuntunganmu
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Hari Hoki</p>
                <p className="font-bold text-sm" style={{ color: sign.warna }}>{sign.hari_hoki.join(' & ')}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Angka Hoki</p>
                <p className="font-bold text-sm" style={{ color: sign.warna }}>{sign.angka_hoki.join(' · ')}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Warna Hoki</p>
                <p className="font-bold text-sm" style={{ color: sign.warna }}>{sign.warna_hoki}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Batu Keberuntungan</p>
                <p className="font-bold text-sm" style={{ color: sign.warna }}>{sign.batu_hoki}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-4 text-center">
            <span className="text-xs text-slate-500 font-medium tracking-widest uppercase">✦ 100% Tidak Ilmiah ✦</span>
          </div>
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        disabled={isSharing || visibleAspects < 4}
        className="w-full py-4 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold flex items-center justify-center gap-3 transition-all outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        )}
        {visibleAspects < 4 ? 'Membaca bintang...' : shareText}
      </button>
    </div>
  );
}
