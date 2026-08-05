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
