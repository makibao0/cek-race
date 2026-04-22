import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

interface RaceData {
  ras: string;
  profesi: string;
  deskripsi: string;
}

export default function RaceResult({ data, name }: { data: RaceData; name: string }) {
  const resultRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareText, setShareText] = useState('Bagikan Hasil');

  if (!name) return null;

  const normalizedRace = data.ras.toLowerCase().replace(/\s+/g, '-');
  const imageUrl = `/races/${normalizedRace}.png`;
  const fallbackUrl = `https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(data.ras + name)}&backgroundColor=transparent `;

  const handleShare = async () => {
    if (!resultRef.current) return;
    setIsSharing(true);
    setShareText('Memproses...');
    try {
      // Capture element as PNG string
      const dataUrl = await toPng(resultRef.current, {
        quality: 1.0,
        backgroundColor: '#020617', // match slate-950 bg
        pixelRatio: 2
      });
      const caption = `Namaku ternyata ras ${data.ras} dengan profesi ${data.profesi}! 🔮\n\nCek rasmu sekarang : https://cek-race.vercel.app/`;

      try {
        const file = await (await fetch(dataUrl)).blob().then(b => new File([b], 'cek-ras.png', { type: 'image/png' }));
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Hasil Cek Ras',
            text: caption,
            files: [file]
          });
          setShareText('Berhasil Dibagikan!');
        } else {
          throw new Error('Web share with files not supported');
        }
      } catch (err) {
        // Fallback: download image & copy to clipboard
        const link = document.createElement('a');
        link.download = 'cek-ras.png';
        link.href = dataUrl;
        link.click();

        try {
          await navigator.clipboard.writeText(caption);
          setShareText('Gambar Disimpan & Teks Disalin!');
        } catch (clipErr) {
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
    <div className="flex flex-col gap-4 mt-16">
      <div ref={resultRef} className="relative overflow-visible rounded-2xl bg-slate-900 border border-white/10 p-8 shadow-2xl transition-all duration-500 hover:shadow-purple-500/10 hover:border-purple-500/30 group">
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl group-hover:bg-purple-400/30 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl group-hover:bg-blue-400/30 transition-colors duration-500" />

        <div className="relative z-10 flex flex-col items-center text-center gap-5 pt-10">

          {/* Ilustrasi Ras */}
          <div className="absolute -top-24 w-36 h-36 shadow-2xl rounded-full overflow-hidden border-4 border-slate-800 bg-gradient-to-b from-purple-500/50 to-pink-500/50 z-20 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={`Ilustrasi ${data.ras}`}
              className="w-full h-full object-cover bg-slate-900"
              crossOrigin="anonymous"
              onError={(e) => {
                e.currentTarget.src = fallbackUrl;
                e.currentTarget.onerror = null;
              }}
            />
          </div>

          <div className="space-y-1 mt-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest">Hasil Analisis Nama</h3>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 capitalize">
              {name}
            </h2>
          </div>

          <div className="w-full h-px bg-white/10 my-1" />

          <div className="flex flex-col gap-1 w-full bg-white/5 py-4 rounded-xl border border-white/5">
            <p className="text-slate-400 uppercase tracking-widest text-xs font-semibold">Identitas Dominan</p>
            <p className="text-4xl font-black text-white tracking-tight drop-shadow-md">
              {data.ras}
            </p>
          </div>

          <div className="w-full">
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-widest font-semibold">Diagnosis Profesi</p>
            <p className="text-xl font-bold text-purple-300 drop-shadow-sm">{data.profesi}</p>
          </div>

          <div className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed italic bg-black/40 p-5 rounded-xl w-full border border-white/5 shadow-inner">
            "{data.deskripsi}"
          </div>
        </div>
      </div>

      <button
        onClick={handleShare}
        disabled={isSharing}
        className="w-full py-4 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold flex items-center justify-center gap-3 transition-all outline-none focus:ring-2 focus:ring-purple-500/50"
      >
        {isSharing && shareText === 'Memproses...' ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : shareText.includes('Berhasil') || shareText.includes('Disimpan') ? (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        )}
        {shareText}
      </button>
    </div>
  );
}
