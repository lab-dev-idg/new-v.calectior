import React from 'react';
import { Landmark, ShieldCheck, Activity, History, Sliders, MessageSquare } from 'lucide-react';
import { LanguageType, TranslationType } from '../utils/translations';

interface NavbarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  lang: LanguageType;
  t: TranslationType;
}

export default function Navbar({ activePage, onPageChange, lang, t }: NavbarProps) {
  const navItems = [
    { id: 'dashboard', label: t.tabs.analytics, icon: Activity },
    { id: 'calculator', label: t.tabs.cargo, icon: Landmark },
    { id: 'lists', label: t.tabs.rules, icon: ShieldCheck },
    { id: 'history', label: t.common.history, icon: History },
    { id: 'audit', label: t.tabs.chat, icon: MessageSquare },
    { id: 'admin', label: t.tabs.admin, icon: Sliders },
  ];

  return (
    <nav className="glass-card p-2 flex flex-wrap gap-1.5 items-center shrink-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            type="button"
            className={`flex items-center gap-2 py-2 px-3.5 text-xs md:text-sm font-black rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-idg-gold text-idg-navy shadow-lg shadow-idg-gold/15'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
