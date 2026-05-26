import React, { useState } from 'react';
import { Scale, ShieldAlert, Sparkles, AlertTriangle, FileText, Landmark, RefreshCw } from 'lucide-react';
import { LanguageType, TranslationType, CategoryType } from '../utils/translations';
import { SystemSettings, CalculatorState, CalculationResult } from '../types';

interface CustomsCalculatorProps {
  settings: SystemSettings;
  lang: LanguageType;
  t: TranslationType;
  addRecord: (category: string, value: number, tax: number, total: number) => void;
}

export default function CustomsCalculator({ settings, lang, t, addRecord }: CustomsCalculatorProps) {
  const [state, setState] = useState<CalculatorState>({
    category: 'ئاسایی',
    weight: 100,
    declaredValue: 2500,
    extraSonar: 0,
    extraLicense: 0,
    extraQuality: 0,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [calculating, setCalculating] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);

    setTimeout(() => {
      const baseRate = settings.customs_rates[state.category] || 5.0;
      const baseTax = state.declaredValue * (baseRate / 100.0);

      let protectionTax = 0.0;
      if (settings.protection.enabled) {
        protectionTax = state.declaredValue * (settings.protection.rate / 100.0);
      }

      // Sum of configured border fees + extra custom fees inputted
      const sonarFee = settings.fixed_fees.sonar + state.extraSonar;
      const cbiFee = settings.fixed_fees.cbi + state.extraQuality;
      const portFee = settings.fixed_fees.port;
      const extraFees = sonarFee + cbiFee + portFee + state.extraLicense;

      const totalUsd = baseTax + protectionTax + extraFees;
      const totalIqdOfficial = totalUsd * settings.currency.official;
      const totalIqdMarket = totalUsd * settings.currency.market;

      setResult({
        baseTaxUsd: baseTax,
        protectionTaxUsd: protectionTax,
        extraFeesUsd: extraFees,
        totalCostUsd: totalUsd,
        totalCostIqdOfficial: totalIqdOfficial,
        totalCostIqdMarket: totalIqdMarket,
        customsRatePercentage: baseRate,
        protectionRatePercentage: settings.protection.enabled ? settings.protection.rate : 0,
      });

      addRecord(
        state.category,
        state.declaredValue,
        baseTax + protectionTax,
        totalUsd
      );

      setCalculating(false);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Parameters panel */}
      <form onSubmit={handleCalculate} className="lg:col-span-5 glass-card p-6 flex flex-col gap-6">
        <div className="border-b border-white/5 pb-4">
          <h2 className="text-xl font-bold font-display text-idg-gold flex items-center gap-2">
            <Scale className="w-5 h-5 text-idg-gold" />
            {t.calculator.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t.subtitle}</p>
        </div>

        {/* Category selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-300 flex items-center justify-between">
            <span>{t.calculator.category}</span>
            <span className="text-[10px] text-idg-gold font-mono bg-idg-gold/10 px-2 py-0.5 rounded-full uppercase">
              Law #22 Art 10
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(settings.customs_rates) as CategoryType[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setState({ ...state, category: cat })}
                className={`py-2 px-3 text-xs rounded-lg font-bold border transition-all duration-200 cursor-pointer ${
                  state.category === cat
                    ? 'bg-idg-gold text-idg-navy border-idg-gold shadow-md'
                    : 'bg-slate-950/40 text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >
                {t.calculator.categoryOptions[cat]}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 leading-normal italic">{t.calculator.categoryHelp}</p>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">{t.calculator.declaredValue}</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 text-sm">$</span>
              <input
                type="number"
                min="0"
                required
                value={state.declaredValue}
                onChange={(e) => setState({ ...state, declaredValue: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="glass-input pl-7 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">{t.calculator.weight}</label>
            <div className="relative">
              <span className="absolute right-3 top-2.5 text-slate-500 text-xs">KG</span>
              <input
                type="number"
                min="0"
                required
                value={state.weight}
                onChange={(e) => setState({ ...state, weight: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="glass-input pr-9 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Custom Ground Fees expandable */}
        <div className="border border-white/5 bg-slate-950/20 rounded-xl p-4">
          <details className="group">
            <summary className="text-sm font-semibold text-slate-200 cursor-pointer select-none flex items-center justify-between outline-none">
              <span className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-slate-400" />
                <span>{t.calculator.groundFees}</span>
              </span>
              <span className="text-xs text-idg-gold transition-transform group-open:rotate-180">▼</span>
            </summary>
            
            <div className="grid grid-cols-1 gap-3 mt-4 pt-3 border-t border-white/5">
              <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded-lg border border-white/5">
                <span className="text-xs text-slate-400">سۆناری سەرەکی: {settings.fixed_fees.sonar} USD</span>
                <span className="text-xs text-slate-400">CBI پشکنین: {settings.fixed_fees.cbi} USD</span>
                <span className="text-xs text-slate-400">بەندەر: {settings.fixed_fees.port} USD</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-400">{t.calculator.sonar} (+)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={state.extraSonar || ''}
                    onChange={(e) => setState({ ...state, extraSonar: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="glass-input py-1.5 px-2 bg-slate-950/80 text-xs text-center"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-400">{t.calculator.license} (+)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={state.extraLicense || ''}
                    onChange={(e) => setState({ ...state, extraLicense: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="glass-input py-1.5 px-2 bg-slate-950/80 text-xs text-center"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-400">{t.calculator.quality} (+)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={state.extraQuality || ''}
                    onChange={(e) => setState({ ...state, extraQuality: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="glass-input py-1.5 px-2 bg-slate-950/80 text-xs text-center"
                  />
                </div>
              </div>
            </div>
          </details>
        </div>

        <button
          type="submit"
          disabled={calculating}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {calculating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{t.calculator.calculating}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-idg-navy fill-idg-navy/20" />
              <span>{t.calculator.calculateBtn}</span>
            </>
          )}
        </button>
      </form>

      {/* Result panel */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="glass-card p-6 flex flex-col gap-6 relative overflow-hidden min-h-[420px] justify-between">
          {/* Radial color accent bg */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-idg-gold/5 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />

          {/* Header */}
          <div className="border-b border-white/5 pb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-idg-gold" />
              {t.calculator.resultsTitle}
            </h2>
            {result && (
              <span className="text-[10px] text-idg-gold border border-idg-gold/30 bg-idg-gold/5 px-2.5 py-1 rounded-md font-mono">
                {lang === 'ku' ? 'خەمڵاندنی لۆکاڵی' : 'LOCAL SIMULATOR'}
              </span>
            )}
          </div>

          {result ? (
            <div className="flex-1 flex flex-col justify-between gap-6 py-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Base custom tax box */}
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 flex flex-col gap-1 text-center justify-center relative">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">{t.calculator.baseTax}</span>
                  <span className="text-xl font-bold text-idg-gold">${result.baseTaxUsd.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-500 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded-md mt-1 mx-auto">
                    {result.customsRatePercentage}% Tariff
                  </span>
                </div>

                {/* Protection tax box */}
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 flex flex-col gap-1 text-center justify-center relative">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">{t.calculator.protectionTax}</span>
                  <span className="text-xl font-bold text-slate-300">
                    {result.protectionTaxUsd > 0 ? `$${result.protectionTaxUsd.toFixed(2)}` : '—'}
                  </span>
                  {result.protectionTaxUsd > 0 ? (
                    <span className="text-[10px] text-amber-500 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded-md mt-1 mx-auto flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> {result.protectionRatePercentage}% Protective
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600 font-mono bg-slate-950/20 px-1.5 py-0.5 rounded-md mt-1 mx-auto">
                      Bypassed
                    </span>
                  )}
                </div>

                {/* Ground Fees burden */}
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 flex flex-col gap-1 text-center justify-center relative">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">{t.calculator.feesTotal}</span>
                  <span className="text-xl font-bold text-slate-300">${result.extraFeesUsd.toFixed(2)}</span>
                  <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-1.5 py-0.5 rounded-md mt-1 mx-auto">
                    CBI + Sonar + Port
                  </span>
                </div>
              </div>

              {/* Mega total sum highlight */}
              <div className="bg-gradient-to-r from-idg-navy/30 w-full to-slate-900/60 rounded-2xl border border-white/10 p-5 mt-auto flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-slate-300">{t.calculator.totalUsd}</span>
                  <span className="text-3xl font-black text-idg-gold font-display">${result.totalCostUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-white/5 flex flex-col">
                    <span className="text-[10px] text-slate-500 mb-0.5">{t.calculator.totalIqdOfficial}</span>
                    <span className="text-sm font-bold text-slate-100 font-mono">
                      {Math.round(result.totalCostIqdOfficial).toLocaleString(lang === 'ku' ? 'ar-IQ' : 'en-US')} IQD
                    </span>
                    <span className="text-[9px] text-emerald-500 mt-1">@ 1 USD = {settings.currency.official} IQD</span>
                  </div>

                  <div className="bg-slate-950/40 p-3 rounded-lg border border-white/5 flex flex-col">
                    <span className="text-[10px] text-slate-500 mb-0.5">{t.calculator.totalIqdMarket}</span>
                    <span className="text-sm font-bold text-amber-500 font-mono">
                      {Math.round(result.totalCostIqdMarket).toLocaleString(lang === 'ku' ? 'ar-IQ' : 'en-US')} IQD
                    </span>
                    <span className="text-[9px] text-amber-500/80 mt-1">@ 1 USD = {settings.currency.market} IQD (Market)</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 text-center">{t.calculator.exchangeNotice}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center gap-4 py-8">
              <div className="w-16 h-16 bg-slate-950/80 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Landmark className="w-8 h-8 text-idg-gold" />
              </div>
              <div className="max-w-md flex flex-col gap-2">
                <h3 className="text-base font-bold font-display text-slate-200">
                  {lang === 'ku' ? 'ئامادەیە بۆ خەمڵاندن' : 'Ready to Estimate'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{t.calculator.readyText}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
