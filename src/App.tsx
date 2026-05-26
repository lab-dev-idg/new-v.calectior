import React, { useState, useEffect } from 'react';
import { Landmark, Scale, Sliders, MessageSquare, ShieldCheck, Globe, Activity, History } from 'lucide-react';
import { translations, defaultSettings, defaultLists, LanguageType } from './utils/translations';
import { SystemSettings, CustomsLists } from './types';
import CustomsCalculator from './components/CustomsCalculator';
import RulesList from './components/RulesList';
import ControlPanel from './components/ControlPanel';
import AiAdvisor from './components/AiAdvisor';
import SystemAnalytics from './components/SystemAnalytics';

export default function App() {
  // Primary language switcher state (defaulting to Kurdish)
  const [lang, setLang] = useState<LanguageType>(() => {
    const saved = localStorage.getItem('idg_lang');
    return (saved as LanguageType) || 'ku';
  });

  const t = translations[lang];

  // System settings state
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('idg_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved settings:", e);
      }
    }
    return defaultSettings;
  });

  // Border goods lists indexing
  const [lists, setLists] = useState<CustomsLists>(() => {
    const saved = localStorage.getItem('idg_lists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved lists:", e);
      }
    }
    return defaultLists;
  });

  // Live calculator estimations history logs
  const [records, setRecords] = useState<Array<{
    id: string;
    timestamp: string;
    category: string;
    value: number;
    tax: number;
    total: number;
  }>>(() => {
    const saved = localStorage.getItem('idg_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved records:", e);
      }
    }
    return [];
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'cargo' | 'rules' | 'admin' | 'chat' | 'analytics'>('cargo');

  // Trigger cache writes on states update
  useEffect(() => {
    localStorage.setItem('idg_lang', lang);
  }, [lang]);

  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem('idg_settings', JSON.stringify(newSettings));
  };

  const updateLists = (newLists: CustomsLists) => {
    setLists(newLists);
    localStorage.setItem('idg_lists', JSON.stringify(newLists));
  };

  const addRecord = (category: string, value: number, tax: number, total: number) => {
    const newRecord = {
      id: `rec-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      category,
      value,
      tax,
      total,
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem('idg_records', JSON.stringify(updated));
  };

  const clearRecords = () => {
    setRecords([]);
    localStorage.removeItem('idg_records');
  };

  const toggleLanguage = () => {
    setLang(prev => (prev === 'ku' ? 'en' : 'ku'));
  };

  return (
    <div className="min-h-screen bg-idg-dark text-slate-100 flex flex-col justify-between py-6 px-4 md:px-8 relative selection:bg-idg-gold selection:text-idg-navy">
      {/* Dynamic ambient backdrop light elements */}
      <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-idg-navy/15 rounded-full blur-3xl -z-50 pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-idg-gold/5 rounded-full blur-3xl -z-50 pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }} />

      {/* Portal wrapper constraint */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Top Header layout */}
        <header className="glass-card p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
          <div className="flex items-center gap-4 text-right md:text-right w-full md:w-auto">
            <div className="w-12 h-12 bg-idg-navy border border-idg-gold/30 rounded-2xl flex items-center justify-center text-idg-gold shadow-lg shadow-idg-gold/10 shrink-0">
              <Landmark className="w-6 h-6 text-idg-gold" />
            </div>

            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl md:text-2xl font-black tracking-tight font-display text-idg-gold">
                {t.title}
              </h1>
              <p className="text-xs text-slate-300 font-sans">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <span className="text-[10px] md:text-xs text-slate-400 font-semibold border border-white/5 bg-slate-950/40 px-3 py-1.5 rounded-lg italic">
              {t.lawCaption}
            </span>

            {/* Language switch toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="btn-secondary py-2 px-3 text-xs flex items-center gap-2 border border-idg-gold/20 hover:border-idg-gold/50 cursor-pointer text-idg-gold active:scale-95 transition-all duration-150"
            >
              <Globe className="w-3.5 h-3.5 text-idg-gold" />
              <span className="font-bold">{lang === 'ku' ? 'English' : 'کوردی'}</span>
            </button>
          </div>
        </header>

        {/* Tab switcher navigation bar */}
        <nav className="glass-card p-2 flex flex-wrap gap-1 md:gap-2 items-center shrink-0">
          <button
            onClick={() => setActiveTab('cargo')}
            type="button"
            className={`flex items-center gap-2 py-2.5 px-4 text-xs md:text-sm font-black rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === 'cargo'
                ? 'bg-idg-gold text-idg-navy shadow-lg shadow-idg-gold/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>{t.tabs.cargo}</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            type="button"
            className={`flex items-center gap-2 py-2.5 px-4 text-xs md:text-sm font-black rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-idg-gold text-idg-navy shadow-lg shadow-idg-gold/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.tabs.rules}</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            type="button"
            className={`flex items-center gap-2 py-2.5 px-4 text-xs md:text-sm font-black rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-idg-gold text-idg-navy shadow-lg shadow-idg-gold/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.tabs.chat}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            type="button"
            className={`flex items-center gap-2 py-2.5 px-4 text-xs md:text-sm font-black rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-idg-gold text-idg-navy shadow-lg shadow-idg-gold/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t.tabs.analytics}</span>
          </button>

          <span className="h-6 w-px bg-white/10 hidden md:inline mx-2" />

          <button
            onClick={() => setActiveTab('admin')}
            type="button"
            className={`flex items-center gap-2 py-2.5 px-4 text-xs md:text-sm font-black rounded-xl transition-all duration-205 cursor-pointer ml-auto ${
              activeTab === 'admin'
                ? 'bg-idg-gold text-idg-navy shadow-lg shadow-idg-gold/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t.tabs.admin}</span>
          </button>
        </nav>

        {/* Dynamic content rendering with pristine alignment */}
        <main className="flex-1 min-h-[480px]">
          {activeTab === 'cargo' && (
            <CustomsCalculator
              settings={settings}
              lang={lang}
              t={t}
              addRecord={addRecord}
            />
          )}

          {activeTab === 'rules' && (
            <RulesList
              lists={lists}
              lang={lang}
              t={t}
            />
          )}

          {activeTab === 'chat' && (
            <AiAdvisor
              lang={lang}
              t={t}
            />
          )}

          {activeTab === 'analytics' && (
            <SystemAnalytics
              settings={settings}
              lists={lists}
              lang={lang}
              t={t}
              records={records}
              clearRecords={clearRecords}
            />
          )}

          {activeTab === 'admin' && (
            <ControlPanel
              settings={settings}
              lists={lists}
              lang={lang}
              t={t}
              updateSettings={updateSettings}
              updateLists={updateLists}
            />
          )}
        </main>

      </div>

      {/* Decorative footer */}
      <footer className="shrink-0 mt-8 border-t border-white/5 pt-4 text-center">
        <p className="text-[11px] text-slate-500 font-medium">
          🏛️ IDG Gateway • پلاتفۆڕمی زیرەکی سنوور • یاسای گومرکی عێراق ژمارە ٢٢ بۆ ساڵی ٢٠١٠ • گشت مافەکان پارێزراون
        </p>
      </footer>
    </div>
  );
}
