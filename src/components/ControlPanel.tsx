import React, { useState, useEffect } from 'react';
import { Save, ToggleLeft, ToggleRight, Scale, Sliders, Landmark, ShieldCheck, DollarSign } from 'lucide-react';
import { LanguageType, TranslationType } from '../utils/translations';
import { SystemSettings, CustomsLists } from '../types';

interface ControlPanelProps {
  settings: SystemSettings;
  lists: CustomsLists;
  lang: LanguageType;
  t: TranslationType;
  updateSettings: (newSettings: SystemSettings) => void;
  updateLists: (newLists: CustomsLists) => void;
}

export default function ControlPanel({ settings, lists, lang, t, updateSettings, updateLists }: ControlPanelProps) {
  // Local reactive states initialized with original prop states
  const [lclRates, setLclRates] = useState({ ...settings.customs_rates });
  const [lclFees, setLclFees] = useState({ ...settings.fixed_fees });
  const [lclCur, setLclCur] = useState({ ...settings.currency });
  const [lclProt, setLclProt] = useState({ ...settings.protection });

  const [allowedText, setAllowedText] = useState(lists.allowed.join(', '));
  const [restrictedText, setRestrictedText] = useState(lists.restricted.join(', '));
  const [prohibitedText, setProhibitedText] = useState(lists.prohibited.join(', '));

  const [showAlert, setShowAlert] = useState(false);

  // Sync to prop updates if any
  useEffect(() => {
    setLclRates({ ...settings.customs_rates });
    setLclFees({ ...settings.fixed_fees });
    setLclCur({ ...settings.currency });
    setLclProt({ ...settings.protection });
  }, [settings]);

  useEffect(() => {
    setAllowedText(lists.allowed.join(', '));
    setRestrictedText(lists.restricted.join(', '));
    setProhibitedText(lists.prohibited.join(', '));
  }, [lists]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call state up-triggers
    updateSettings({
      customs_rates: lclRates,
      fixed_fees: lclFees,
      currency: lclCur,
      protection: lclProt,
    });

    const parsedAllowed = allowedText.split(',').map(item => item.trim()).filter(item => item !== '');
    const parsedRestricted = restrictedText.split(',').map(item => item.trim()).filter(item => item !== '');
    const parsedProhibited = prohibitedText.split(',').map(item => item.trim()).filter(item => item !== '');

    updateLists({
      allowed: parsedAllowed,
      restricted: parsedRestricted,
      prohibited: parsedProhibited,
    });

    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Alert Banner */}
      {showAlert && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-400 font-bold text-sm animate-bounce text-right">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span className="flex-1">{t.admin.successUpdate}</span>
        </div>
      )}

      {/* Header title */}
      <div className="glass-card p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <h2 className="text-xl font-bold font-display text-idg-gold flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            {t.admin.title}
          </h2>
          <p className="text-xs text-slate-400">{t.admin.subtitle}</p>
        </div>

        <button
          type="submit"
          className="btn-primary flex items-center gap-2 w-full md:w-auto shrink-0 justify-center cursor-pointer"
        >
          <Save className="w-4 h-4 text-idg-navy" />
          <span>{t.admin.updateBtn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left column config blocks */}
        <div className="flex flex-col gap-6">
          
          {/* Rate multipliers panel */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-200 border-b border-white/5 pb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-idg-gold" />
              {t.admin.customsRates}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">{t.calculator.categoryOptions.ئاسایی}</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-2.5 text-slate-500 text-xs font-mono">%</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={lclRates.ئاسایی}
                    onChange={(e) => setLclRates({ ...lclRates, ئاسایی: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) })}
                    className="glass-input pr-9 py-2 text-sm text-center"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">{t.calculator.categoryOptions.پیشەسازی}</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-2.5 text-slate-500 text-xs font-mono">%</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={lclRates.پیشەسازی}
                    onChange={(e) => setLclRates({ ...lclRates, پیشەسازی: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) })}
                    className="glass-input pr-9 py-2 text-sm text-center"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">{t.calculator.categoryOptions.لوکس}</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-2.5 text-slate-500 text-xs font-mono">%</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={lclRates.لوکس}
                    onChange={(e) => setLclRates({ ...lclRates, لوکس: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) })}
                    className="glass-input pr-9 py-2 text-sm text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Standalone Base Border Fees Panel */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-200 border-b border-white/5 pb-2 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-idg-gold" />
              {t.admin.fixedFees}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">{t.admin.sonar}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    value={lclFees.sonar}
                    onChange={(e) => setLclFees({ ...lclFees, sonar: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="glass-input pl-7 py-2 text-sm text-center"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">{t.admin.cbi}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    value={lclFees.cbi}
                    onChange={(e) => setLclFees({ ...lclFees, cbi: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="glass-input pl-7 py-2 text-sm text-center"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">{t.admin.port}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    min="0"
                    value={lclFees.port}
                    onChange={(e) => setLclFees({ ...lclFees, port: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="glass-input pl-7 py-2 text-sm text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Currencies target */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-200 border-b border-white/5 pb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-idg-gold" />
              {t.admin.currency}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">{t.admin.officialRate}</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-2.5 text-slate-500 text-xs">IQD</span>
                  <input
                    type="number"
                    min="1"
                    value={lclCur.official}
                    onChange={(e) => setLclCur({ ...lclCur, official: Math.max(1, parseFloat(e.target.value) || 0) })}
                    className="glass-input pr-11 py-2 text-sm text-center font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">{t.admin.marketRate}</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-2.5 text-slate-500 text-xs">IQD</span>
                  <input
                    type="number"
                    min="1"
                    value={lclCur.market}
                    onChange={(e) => setLclCur({ ...lclCur, market: Math.max(1, parseFloat(e.target.value) || 0) })}
                    className="glass-input pr-11 py-2 text-sm text-center font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right column protective tariff list modifications */}
        <div className="flex flex-col gap-6">

          {/* National safety tariff and products protection */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-200 border-b border-white/5 pb-2 flex justify-between items-center">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-idg-gold" />
                {t.admin.protection}
              </span>
              
              {/* Toggle switch representation */}
              <button
                type="button"
                onClick={() => setLclProt({ ...lclProt, enabled: !lclProt.enabled })}
                className="text-idg-gold hover:text-idg-gold-hover cursor-pointer"
              >
                {lclProt.enabled ? (
                  <ToggleRight className="w-10 h-10 transition-transform" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-600 transition-transform" />
                )}
              </button>
            </h3>

            <div className={`flex flex-col gap-1 transition-all duration-300 ${lclProt.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <label className="text-xs text-slate-300">{t.admin.protectionRate}</label>
              <div className="relative max-w-xs">
                <span className="absolute right-3.5 top-2.5 text-slate-500 text-xs font-mono">%</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  disabled={!lclProt.enabled}
                  value={lclProt.rate}
                  onChange={(e) => setLclProt({ ...lclProt, rate: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)) })}
                  className="glass-input pr-9 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Comma-separated list modifications */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-200 border-b border-white/5 pb-2">
              {t.admin.lists}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-emerald-400 font-semibold">{t.rules.allowed}</label>
                <textarea
                  rows={2}
                  value={allowedText}
                  onChange={(e) => setAllowedText(e.target.value)}
                  className="glass-input py-2 px-3 text-xs resize-none"
                  placeholder="e.g., Electronics, Clothes"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-amber-400 font-semibold">{t.rules.restricted}</label>
                <textarea
                  rows={2}
                  value={restrictedText}
                  onChange={(e) => setRestrictedText(e.target.value)}
                  className="glass-input py-2 px-3 text-xs resize-none"
                  placeholder="e.g., Medicine, Chemicals"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-red-550 font-semibold text-red-400">{t.rules.prohibited}</label>
                <textarea
                  rows={2}
                  value={prohibitedText}
                  onChange={(e) => setProhibitedText(e.target.value)}
                  className="glass-input py-2 px-3 text-xs resize-none"
                  placeholder="e.g., Weaponry, Narcotics"
                />
              </div>

              <p className="text-[10.5px] italic text-slate-500 leading-normal">{t.admin.listHelp}</p>
            </div>
          </div>

        </div>

      </div>

    </form>
  );
}
