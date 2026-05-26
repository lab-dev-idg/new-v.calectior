import React, { useState, useEffect } from 'react';
import { translations, defaultSettings, defaultLists, LanguageType } from './utils/translations';
import { SystemSettings, CustomsLists } from './types';

// Layout and Global controls
import MainLayout from './layouts/MainLayout';

// Modular Pages
import DashboardPage from './pages/DashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import ProductListsPage from './pages/ProductListsPage';
import HistoryPage from './pages/HistoryPage';
import AuditLogsPage from './pages/AuditLogsPage';
import ControlPanel from './components/ControlPanel';

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

  // Active navigation tab (configured: dashboard, calculator, lists, history, audit, admin)
  const [activePage, setActivePage] = useState<string>('dashboard');

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

  const deleteSingleRecord = (id: string) => {
    const updated = records.filter(rec => rec.id !== id);
    setRecords(updated);
    localStorage.setItem('idg_records', JSON.stringify(updated));
  };

  const toggleLanguage = () => {
    setLang(prev => {
      if (prev === 'ku') return 'en';
      if (prev === 'en') return 'ar';
      return 'ku';
    });
  };

  return (
    <MainLayout
      lang={lang}
      toggleLanguage={toggleLanguage}
      t={t}
      settings={settings}
      lists={lists}
      activePage={activePage}
      onPageChange={setActivePage}
    >
      {/* Route matching component tree content */}
      <div className="flex-1 w-full flex flex-col justify-between">
        {activePage === 'dashboard' && (
          <DashboardPage
            settings={settings}
            lists={lists}
            lang={lang}
            t={t}
            records={records}
            clearRecords={clearRecords}
          />
        )}

        {activePage === 'calculator' && (
          <CalculatorPage
            settings={settings}
            lang={lang}
            t={t}
            addRecord={addRecord}
          />
        )}

        {activePage === 'lists' && (
          <ProductListsPage
            lists={lists}
            lang={lang}
            t={t}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage
            records={records}
            clearRecords={clearRecords}
            lang={lang}
            t={t}
            onDeleteRecord={deleteSingleRecord}
          />
        )}

        {activePage === 'audit' && (
          <AuditLogsPage
            lang={lang}
            t={t}
          />
        )}

        {activePage === 'admin' && (
          <ControlPanel
            settings={settings}
            lists={lists}
            lang={lang}
            t={t}
            updateSettings={updateSettings}
            updateLists={updateLists}
          />
        )}
      </div>
    </MainLayout>
  );
}
