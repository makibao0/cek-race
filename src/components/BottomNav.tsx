'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Activity, Star, Moon, Heart } from 'lucide-react';

const TABS = [
  {
    href: '/',
    label: 'Cek Ras',
    icon: Sparkles,
    activeGradient: 'from-purple-600/30 to-indigo-600/30',
    activeText: 'text-purple-300',
    activeBorder: 'border-purple-500/30',
    activeShadow: 'shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]',
    activeIcon: 'text-purple-400',
  },
  {
    href: '/aura',
    label: 'Cek Aura',
    icon: Activity,
    activeGradient: 'from-pink-600/30 to-rose-600/30',
    activeText: 'text-pink-300',
    activeBorder: 'border-pink-500/30',
    activeShadow: 'shadow-[inset_0_0_15px_rgba(236,72,153,0.2)]',
    activeIcon: 'text-pink-400',
  },
  {
    href: '/tarot',
    label: 'Tarot',
    icon: Star,
    activeGradient: 'from-amber-600/30 to-violet-600/30',
    activeText: 'text-amber-300',
    activeBorder: 'border-amber-500/30',
    activeShadow: 'shadow-[inset_0_0_15px_rgba(251,191,36,0.2)]',
    activeIcon: 'text-amber-400',
  },
  {
    href: '/zodiak',
    label: 'Zodiak',
    icon: Moon,
    activeGradient: 'from-cyan-600/30 to-indigo-600/30',
    activeText: 'text-cyan-300',
    activeBorder: 'border-cyan-500/30',
    activeShadow: 'shadow-[inset_0_0_15px_rgba(34,211,238,0.2)]',
    activeIcon: 'text-cyan-400',
  },
  {
    href: '/donasi',
    label: 'Donasi',
    icon: Heart,
    activeGradient: 'from-rose-600/30 to-pink-600/30',
    activeText: 'text-rose-300',
    activeBorder: 'border-rose-500/30',
    activeShadow: 'shadow-[inset_0_0_15px_rgba(244,63,94,0.2)]',
    activeIcon: 'text-rose-400',
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-5 md:pb-3 pointer-events-none flex justify-center">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-1.5 flex gap-1 pointer-events-auto shadow-purple-900/20">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1 px-2.5 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? `bg-linear-to-r ${tab.activeGradient} ${tab.activeText} border ${tab.activeBorder} ${tab.activeShadow}`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? tab.activeIcon : ''}`} />
              <span className="font-semibold text-xs whitespace-nowrap">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
