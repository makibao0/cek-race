'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Activity } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 md:pb-4 pointer-events-none flex justify-center">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-2 flex gap-2 pointer-events-auto shadow-purple-900/20">
        <Link 
          href="/" 
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
            pathname === '/' 
              ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 border border-purple-500/30 shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${pathname === '/' ? 'text-purple-400' : ''}`} />
          <span className="font-semibold text-sm">Cek Ras</span>
        </Link>
        
        <Link 
          href="/aura" 
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
            pathname === '/aura' 
              ? 'bg-gradient-to-r from-pink-600/30 to-rose-600/30 text-pink-300 border border-pink-500/30 shadow-[inset_0_0_15px_rgba(236,72,153,0.2)]' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Activity className={`w-5 h-5 ${pathname === '/aura' ? 'text-pink-400' : ''}`} />
          <span className="font-semibold text-sm">Cek Aura</span>
        </Link>
      </div>
    </div>
  );
}
