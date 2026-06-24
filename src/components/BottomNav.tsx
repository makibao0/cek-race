'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Activity, Star, Moon, Heart } from 'lucide-react';

const TABS = [
  {
    href: '/',
    label: 'Cek Ras',
    icon: Sparkles,
    color: 'text-purple-400',
    dot: 'bg-purple-400',
    activeBg: 'bg-purple-500/15',
    activeBorder: 'border-purple-500/30',
  },
  {
    href: '/aura',
    label: 'Aura',
    icon: Activity,
    color: 'text-pink-400',
    dot: 'bg-pink-400',
    activeBg: 'bg-pink-500/15',
    activeBorder: 'border-pink-500/30',
  },
  {
    href: '/tarot',
    label: 'Tarot',
    icon: Star,
    color: 'text-amber-400',
    dot: 'bg-amber-400',
    activeBg: 'bg-amber-500/15',
    activeBorder: 'border-amber-500/30',
  },
  {
    href: '/zodiak',
    label: 'Zodiak',
    icon: Moon,
    color: 'text-cyan-400',
    dot: 'bg-cyan-400',
    activeBg: 'bg-cyan-500/15',
    activeBorder: 'border-cyan-500/30',
  },
  {
    href: '/donasi',
    label: 'Donasi',
    icon: Heart,
    color: 'text-rose-400',
    dot: 'bg-rose-400',
    activeBg: 'bg-rose-500/15',
    activeBorder: 'border-rose-500/30',
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-3 pb-6 md:pb-4 pointer-events-none">
      <nav className="pointer-events-auto bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-1.5 flex items-center gap-0.5">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 outline-none
                px-3.5 py-2 min-w-12
                md:flex-row md:gap-1.5 md:px-4 md:py-2.5
                ${isActive
                  ? `${tab.activeBg} border ${tab.activeBorder} ${tab.color}`
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />

              {/* Label: always visible on md+, hidden on mobile unless active */}
              <span className={`
                font-semibold whitespace-nowrap transition-all duration-300
                text-[10px] mt-0.5
                md:text-xs md:mt-0
                ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden md:opacity-60 md:h-auto md:overflow-visible'}
              `}>
                {tab.label}
              </span>

              {/* Active dot indicator on mobile */}
              {isActive && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${tab.dot} md:hidden`} />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
