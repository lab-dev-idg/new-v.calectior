import React from 'react';
import { Activity, ShieldCheck, Scale, AlertTriangle, Cpu } from 'lucide-react';
import { LanguageType, TranslationType } from '../utils/translations';
import { SystemSettings, CustomsLists } from '../types';
import { PORTAL_SYSTEM_INFO, SOUND_HEALTH_PULSE } from '../lib/constants';

interface SidebarProps {
  lang: LanguageType;
  t: TranslationType;
  settings: SystemSettings;
  lists: CustomsLists;
}

export default function Sidebar({ lang, t, settings, lists }: SidebarProps) {
  const totalListsItems = lists.allowed.length + lists.restricted.length + lists.prohibited.length;

  return (
    <div className="w-full md:w-64 lg:w-72 flex flex-col gap-4 shrink-0">
      
      {/* AI predictor pulse & System info */}
      <div className="glass-card p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xs font-bold text-idg-gold uppercase tracking-widest mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-idg-gold" />
            <span>
              {lang === 'ku' 
                ? 'چاودێری زیرەکی سیستەم' 
                : lang === 'ar' 
                  ? 'مراقبة النظام الذكي' 
                  : 'AI SYSTEM PULSE'}
            </span>
          </h2>

          <div className="space-y-4">
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
              <div>
                <span className="stat-label">
                  {lang === 'ku' 
                    ? 'لێکدانی ئەلگۆریتم' 
                    : lang === 'ar' 
                      ? 'نبض النظام' 
                      : 'System Pulse'}
                </span>
              </div>
              <div className="flex items-baseline justify-center gap-2 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-2xl font-mono font-bold text-slate-100">{SOUND_HEALTH_PULSE}</span>
              </div>
              <p className="text-[9px] opacity-50 font-mono tracking-wider mt-1.5 uppercase">
                AI ENGINE: {PORTAL_SYSTEM_INFO.modelName}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="opacity-60">
                  {lang === 'ku' 
                    ? 'یاسای چالاک:' 
                    : lang === 'ar' 
                      ? 'التشريع النشط:' 
                      : 'Customs Legislation:'}
                </span>
                <span className="font-semibold text-idg-gold font-sans text-[10px]">{t.lawCaption.slice(0, 16)}...</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="opacity-60">
                  {lang === 'ku' 
                    ? 'کۆدی تێرمینال:' 
                    : lang === 'ar' 
                      ? 'رمز الطرفية:' 
                      : 'Terminal Node:'}
                </span>
                <span className="font-mono font-bold">{PORTAL_SYSTEM_INFO.terminalCode}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="opacity-60">
                  {lang === 'ku' 
                    ? 'پاراستنی کاڵا:' 
                    : lang === 'ar' 
                      ? 'الحماية الوطنية:' 
                      : 'National Protection:'}
                </span>
                <span className={`font-bold ${settings.protection.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {settings.protection.enabled ? `${settings.protection.rate}%` : 'OFF'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Lists Summary Card */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-bold text-idg-gold uppercase tracking-widest mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>
            {lang === 'ku' 
              ? 'کورتەی کاڵاکان' 
              : lang === 'ar' 
                ? 'ملخص السلع' 
                : 'GATEWAY COMMODITIES'}
          </span>
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {lang === 'ku' ? 'ڕێگەپێدراو' : lang === 'ar' ? 'المسموح به' : 'Allowed'}
            </span>
            <span className="font-mono font-bold text-slate-300">
              {lists.allowed.length} {lang === 'ku' ? 'بار' : lang === 'ar' ? 'عنصر' : 'items'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {lang === 'ku' ? 'پێویست بە مۆڵەت' : lang === 'ar' ? 'المقيد بموافقة' : 'Restricted'}
            </span>
            <span className="font-mono font-bold text-slate-300">
              {lists.restricted.length} {lang === 'ku' ? 'بار' : lang === 'ar' ? 'عنصر' : 'items'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-rose-500 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {lang === 'ku' ? 'قەدەغەکراو' : lang === 'ar' ? 'المحظور قاطعاً' : 'Prohibited'}
            </span>
            <span className="font-mono font-bold text-slate-300">
              {lists.prohibited.length} {lang === 'ku' ? 'بار' : lang === 'ar' ? 'عنصر' : 'items'}
            </span>
          </div>
        </div>

        <div className="bg-white/5 p-3 rounded-xl border border-white/5 mt-4 text-center">
          <span className="stat-label text-[9px] block mb-0.5">
            {lang === 'ku' 
              ? 'کۆی گشتی چاودێریکراو' 
              : lang === 'ar' 
                ? 'إجمالي السلع المراقبة' 
                : 'Total Monitored Items'}
          </span>
          <span className="text-base font-bold text-idg-gold font-mono">{totalListsItems}</span>
        </div>
      </div>

    </div>
  );
}
