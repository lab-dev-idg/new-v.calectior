import React from 'react';
import { Landmark, Globe } from 'lucide-react';
import { LanguageType, TranslationType } from '../utils/translations';
import { SystemSettings } from '../types';
import { PORTAL_SYSTEM_INFO } from '../lib/constants';

interface TopbarProps {
  lang: LanguageType;
  toggleLanguage: () => void;
  t: TranslationType;
  settings: SystemSettings;
}

export default function Topbar({ lang, toggleLanguage, t, settings }: TopbarProps) {
  const currencySpread = settings.currency.market - settings.currency.official;

  return (
    <header className="min-h-24 md:min-h-20 border-b border-white/10 flex flex-col md:flex-row items-center justify-between px-6 md:px-8 bg-[#002D62] relative z-20 shrink-0 gap-4 md:gap-0 py-4 md:py-3 rounded-2xl md:rounded-b-none shadow-xl">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#f3d05a] rounded-xl flex items-center justify-center text-xl shadow-lg border border-white/10 shrink-0 select-none">
          🏛️
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-3">
            <h1 className="text-base md:text-lg font-black text-[#D4AF37] tracking-tight font-display flex items-center gap-2">
              <span>{lang === 'ku' ? 'دەروازەی دیجیتاڵی عێراق' : lang === 'ar' ? 'بوابة العراق الرقمية' : 'IRAQ DIGITAL GATEWAY'}</span>
            </h1>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[9px] md:text-[10px] text-emerald-400 font-bold bg-emerald-950/55 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shadow-inner select-none font-sans self-start md:self-auto">
              {t.lawCaption}
            </span>
          </div>
          <p className="text-[10px] md:text-xs font-semibold text-slate-200 leading-tight">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 md:gap-6 w-full md:w-auto">
        {/* Real-time rates summary metrics */}
        <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-4">
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-wider text-slate-450 text-white/50">CBI Official Rate</span>
            <span className="text-xs font-mono font-bold text-slate-100">{settings.currency.official.toLocaleString()} IQD</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-wider text-[#D4AF37]">Market Rate</span>
            <span className="text-xs font-mono font-bold text-[#D4AF37]">{settings.currency.market.toLocaleString()} IQD</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400">Exchange Margin</span>
            <span className="text-xs font-mono font-bold text-emerald-400">+{currencySpread} IQD</span>
          </div>
        </div>

        {/* User state and lang translation */}
        <div className="flex items-center gap-3 ml-auto md:ml-0">
          {/* Language trigger */}
          <button
            onClick={toggleLanguage}
            type="button"
            className="bg-white/5 text-xs text-idg-gold border border-idg-gold/20 hover:border-idg-gold/50 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer hover:bg-white/10 transition-all active:scale-95 select-none"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>
              {lang === 'ku' ? 'کوردی' : lang === 'en' ? 'English' : 'العربية'}
            </span>
          </button>

          <div className="text-right text-xs">
            <p className="font-semibold text-slate-100">{PORTAL_SYSTEM_INFO.adminName}</p>
            <p className="opacity-50 text-[10px] text-slate-300">ID: {PORTAL_SYSTEM_INFO.adminId}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center text-xs font-bold text-[#D4AF37]">
            SA
          </div>
        </div>
      </div>
    </header>
  );
}
