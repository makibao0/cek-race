'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function DonasiPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('085156789012');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden bg-slate-950 font-sans text-slate-200">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-700/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[300px] h-[100px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['💖', '✨', '💫', '🌟', '💝', '⭐', '💕', '🌸'].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-lg opacity-0 animate-[floatUp_linear_infinite]"
            style={{
              left: `${10 + i * 11}%`,
              bottom: '-5%',
              animationDuration: `${4 + (i % 4)}s`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        {/* Badge */}
        <div className="inline-block border border-rose-500/30 rounded-full px-4 py-1.5 bg-rose-500/10 backdrop-blur-sm text-rose-300 text-xs font-semibold tracking-wider">
          💖 DUKUNG KREATOR
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-rose-300 via-pink-300 to-amber-300 drop-shadow-lg">
            Traktir Developer
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xs mx-auto leading-relaxed">
            Kalau kamu suka app ini, yuk traktir developer kopi biar tetap semangat bikin fitur baru! ☕
          </p>
        </div>

        {/* QR Card */}
        <div className="relative group w-full">
          {/* Glow border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500 animate-[pulse_3s_ease-in-out_infinite]" />

          <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-5 flex flex-col items-center gap-4 shadow-2xl overflow-hidden">
            {/* Inner glow */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(244,63,94,0.4), transparent 70%)',
              }}
            />

            {/* QR Code */}
            <div className="relative z-10 rounded-xl overflow-hidden border-4 border-white shadow-lg shadow-rose-500/20">
              <Image
                src="/qr.jpeg"
                alt="QR Code Donasi"
                width={240}
                height={240}
                className="block"
                priority
              />
            </div>

            {/* Scan instruction */}
            <div className="relative z-10 flex items-center gap-2 bg-slate-800/60 rounded-xl px-4 py-2.5 border border-white/10 w-full justify-center">
              <span className="text-base">📱</span>
              <span className="text-slate-300 text-sm font-medium">Scan QRIS dengan aplikasi apapun</span>
            </div>

            {/* Supported apps */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 w-full">
              <p className="text-slate-500 text-xs uppercase tracking-wider">Bisa bayar via</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['GoPay', 'OVO', 'Dana', 'ShopeePay', 'BCA', 'Mandiri', 'LinkAja'].map((app) => (
                  <span
                    key={app}
                    className="text-xs bg-slate-800 border border-slate-700/60 text-slate-300 px-2.5 py-1 rounded-lg"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thank you */}
        <div className="text-center space-y-1">
          <p className="text-slate-400 text-sm">Setiap donasi sekecil apapun sangat berarti 🙏</p>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 font-bold text-base">
            Terima kasih sudah mendukung!
          </p>
        </div>

        {/* Stats decoration */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { icon: '✨', label: 'Fitur Gratis', value: '100%' },
            { icon: '🔮', label: 'Tanpa Iklan', value: 'Selamanya' },
            { icon: '💖', label: 'Dibuat dengan', value: 'Cinta' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-slate-900/60 border border-white/10 rounded-xl p-3 text-center"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-white font-bold text-xs">{item.value}</div>
              <div className="text-slate-500 text-[10px] mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-110vh) scale(0.5); opacity: 0; }
        }
      ` }} />
    </main>
  );
}
