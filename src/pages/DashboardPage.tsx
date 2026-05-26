import React from 'react';
import SystemAnalytics from '../components/SystemAnalytics';
import { LanguageType, TranslationType } from '../utils/translations';
import { SystemSettings, CustomsLists } from '../types';

interface DashboardPageProps {
  settings: SystemSettings;
  lists: CustomsLists;
  lang: LanguageType;
  t: TranslationType;
  records: Array<{
    id: string;
    timestamp: string;
    category: string;
    value: number;
    tax: number;
    total: number;
  }>;
  clearRecords: () => void;
}

export default function DashboardPage({
  settings,
  lists,
  lang,
  t,
  records,
  clearRecords
}: DashboardPageProps) {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="glass-card p-4 flex flex-col justify-center border-l-4 border-idg-gold">
        <h2 className="text-base font-bold text-idg-gold uppercase tracking-wider">
          {lang === 'ku' ? 'ئامارەکانی خاڵی سنووری و بازرگانی عێراق' : 'Operational Border Dashboard'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ku' ? 'چاودێریکردن و پێداچوونەوەی ڕێژەی سەرانەکان و بەها کاتیەکانی دینار و دۆلار' : 'Real-time telemetry of borders customs duties, market valuation metrics and safety safeguards.'}
        </p>
      </div>

      <SystemAnalytics
        settings={settings}
        lists={lists}
        lang={lang}
        t={t}
        records={records}
        clearRecords={clearRecords}
      />
    </div>
  );
}
