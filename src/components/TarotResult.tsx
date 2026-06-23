'use client';

import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import type { DrawnCard } from '@/app/tarot/page';

interface Props {
  cards: DrawnCard[];
  name: string;
}

function CardBack() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-white/10 overflow-hidden">
      {/* Celtic knot-like pattern */}
      <div className="absolute inset-2 rounded-lg border border-violet-500/20" />
      <div className="absolute inset-4 rounded-md border border-amber-500/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border border-violet-500/30 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center">
            <span className="text-2xl opacity-60">✦</span>
          </div>
        </div>
      </div>
      {/* Corner decorations */}
      <span className="absolute top-2 left-2 text-xs text-violet-500/40">✦</span>
      <span className="absolute top-2 right-2 text-xs text-violet-500/40">✦</span>
      <span className="absolute bottom-2 left-2 text-xs text-violet-500/40">✦</span>
      <span className="absolute bottom-2 right-2 text-xs text-violet-500/40">✦</span>
    </div>
  );
}

function TarotCard({ drawn, index, revealed }: { drawn: DrawnCard; index: number; revealed: boolean }) {
  const positionColors = ['from-violet-600/30 to-indigo-600/30', 'from-amber-600/30 to-orange-600/30', 'from-rose-600/30 to-pink-600/30'];
  const positionBorders = ['border-violet-500/40', 'border-amber-500/40', 'border-rose-500/40'];
  const positionShadows = ['shadow-violet-500/20', 'shadow-amber-500/20', 'shadow-rose-500/20'];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Position label */}
      <div className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r ${positionColors[index]} border ${positionBorders[index]} text-slate-200`}>
        {drawn.position}
      </div>

      {/* 3D flip card */}
      <div
        className="relative"
        style={{ width: '110px', height: '180px', perspective: '800px' }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Card back */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
            <CardBack />
          </div>

          {/* Card front */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div
              className={`absolute inset-0 rounded-xl border ${positionBorders[index]} overflow-hidden shadow-lg ${positionShadows[index]}`}
              style={{
                background: `linear-gradient(135deg, #1e1b4b 0%, #0f172a 60%, #1e1b2e 100%)`,
                boxShadow: `0 0 20px 2px ${drawn.card.warna}30`,
                transform: drawn.isReversed ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              {/* Top arc */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                style={{ background: `linear-gradient(90deg, transparent, ${drawn.card.warna}, transparent)` }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-between p-2 pt-3 pb-3">
                {/* Roman numeral */}
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">{String(drawn.card.id).padStart(2, '0')}</span>

                {/* Emoji */}
                <div
                  className="text-4xl drop-shadow-lg"
                  style={{ filter: `drop-shadow(0 0 8px ${drawn.card.warna}80)` }}
                >
                  {drawn.card.emoji}
                </div>

                {/* Card name */}
                <div className="text-center">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">{drawn.isReversed ? '↕ Terbalik' : '↑ Tegak'}</p>
                  <p
                    className="text-[11px] font-black leading-tight mt-0.5"
                    style={{ color: drawn.card.warna }}
                  >
                    {drawn.card.nama}
                  </p>
                </div>
              </div>

              {/* Glow overlay */}
              <div
                className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 40%, ${drawn.card.warna}, transparent 70%)` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TarotResult({ cards, name }: Props) {
  const resultRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState([false, false, false]);
  const [isSharing, setIsSharing] = useState(false);
  const [shareText, setShareText] = useState('Bagikan Hasil');
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    // Reveal cards one by one with stagger
    [0, 1, 2].forEach((i) => {
      setTimeout(() => {
        setRevealed((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        if (i === 2) {
          setTimeout(() => setAllRevealed(true), 1000);
        }
      }, i * 700 + 400);
    });
  }, []);

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
      const caption = `Kartu Tarotku:\n🔮 ${cards[0].card.nama} (${cards[0].position})\n✨ ${cards[1].card.nama} (${cards[1].position})\n🌟 ${cards[2].card.nama} (${cards[2].position})\n\nCek tarotmu: https://cek-race.vercel.app/tarot`;

      try {
        const file = await fetch(dataUrl).then(r => r.blob()).then(b => new File([b], 'tarot.png', { type: 'image/png' }));
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'Bacaan Tarotku', text: caption, files: [file] });
          setShareText('Berhasil Dibagikan!');
        } else throw new Error('no file share');
      } catch {
        const a = document.createElement('a');
        a.download = 'tarot.png';
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
        <div className="relative w-full rounded-2xl bg-slate-900 border border-white/10 p-5 shadow-2xl overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3), transparent 70%)' }} />

          {/* Header */}
          <div className="relative z-10 text-center mb-5">
            <p className="text-slate-400 uppercase tracking-widest text-xs font-semibold">Bacaan Tarot untuk</p>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-violet-300 capitalize mt-1">
              {name}
            </h2>
          </div>

          {/* 3 Cards row */}
          <div className="relative z-10 flex justify-center gap-4 mb-6">
            {cards.map((drawn, i) => (
              <TarotCard key={i} drawn={drawn} index={i} revealed={revealed[i]} />
            ))}
          </div>

          {/* Card readings - reveal after all cards flipped */}
          <div
            className={`relative z-10 flex flex-col gap-3 transition-all duration-700 ${allRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {cards.map((drawn, i) => {
              const reading = drawn.isReversed ? drawn.card.reversed : drawn.card.upright;
              const positionColors = ['text-violet-300', 'text-amber-300', 'text-rose-300'];
              const borderColors = ['border-violet-500/30', 'border-amber-500/30', 'border-rose-500/30'];
              const bgColors = ['bg-violet-500/5', 'bg-amber-500/5', 'bg-rose-500/5'];

              return (
                <div
                  key={i}
                  className={`rounded-xl border ${borderColors[i]} ${bgColors[i]} p-4 transition-all duration-500`}
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{drawn.card.emoji}</span>
                    <div>
                      <p className={`font-black text-sm ${positionColors[i]}`}>
                        {drawn.card.nama}
                        <span className="font-normal text-slate-400 ml-1">— {drawn.position}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 italic">{reading.makna}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    "{reading.deskripsi}"
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer tag */}
          <div className="relative z-10 mt-4 text-center">
            <span className="text-xs text-slate-500 font-medium tracking-widest uppercase">✦ 100% Tidak Ilmiah ✦</span>
          </div>
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        disabled={isSharing || !allRevealed}
        className="w-full py-4 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold flex items-center justify-center gap-3 transition-all outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSharing && shareText === 'Memproses...' ? (
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        {allRevealed ? shareText : 'Menunggu kartu terbuka...'}
      </button>
    </div>
  );
}
