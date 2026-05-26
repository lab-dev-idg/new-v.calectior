import React from 'react';
import CustomsCalculator from '../components/CustomsCalculator';
import { LanguageType, TranslationType } from '../utils/translations';
import { SystemSettings } from '../types';

interface CalculatorPageProps {
  settings: SystemSettings;
  lang: LanguageType;
  t: TranslationType;
  addRecord: (category: string, value: number, tax: number, total: number) => void;
}

export default function CalculatorPage({ settings, lang, t, addRecord }: CalculatorPageProps) {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="glass-card p-4 flex flex-col justify-center border-l-4 border-idg-gold">
        <h2 className="text-base font-bold text-idg-gold uppercase tracking-wider">
          {t.calculator.title || 'Cargo Parameter Predictor'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ku' ? 'هەڵسەنگاندنی تێچووی باجی گومرگی هەمبەر بە مەنشەئی کاڵاکەت بە یاسایی نوێ' : 'Evaluate standard, luxury or industrial cargo tax loads with administrative protective tariffs and ground rates.'}
        </p>
      </div>

      <CustomsCalculator
        settings={settings}
        lang={lang}
        t={t}
        addRecord={addRecord}
      />
    </div>
  );
}
