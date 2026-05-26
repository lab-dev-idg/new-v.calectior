import React from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { LanguageType, TranslationType } from '../utils/translations';
import { SystemSettings, CustomsLists } from '../types';
import { PORTAL_SYSTEM_INFO } from '../lib/constants';

interface MainLayoutProps {
  children: React.ReactNode;
  lang: LanguageType;
  toggleLanguage: () => void;
  t: TranslationType;
  settings: SystemSettings;
  lists: CustomsLists;
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function MainLayout({
  children,
  lang,
  toggleLanguage,
  t,
  settings,
  lists,
  activePage,
  onPageChange
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between py-4 px-4 md:px-8 relative selection:bg-[#D4AF37] selection:text-[#002D62] font-sans">
      {/* Dynamic atmospheric light elements */}
      <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-[#002D62]/20 rounded-full blur-3xl -z-50 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl -z-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        {/* Topbar branding and exchange counters */}
        <Topbar
          lang={lang}
          toggleLanguage={toggleLanguage}
          t={t}
          settings={settings}
        />

        {/* Navigation router bar */}
        <Navbar
          activePage={activePage}
          onPageChange={onPageChange}
          lang={lang}
          t={t}
        />

        {/* Live operational interface grid (Sidebar left + Dynamic page right) */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1">
          
          <Sidebar
            lang={lang}
            t={t}
            settings={settings}
            lists={lists}
          />

          <main className="flex-1 min-h-[500px] flex flex-col justify-between">
            {children}
          </main>

        </div>

      </div>

      {/* Corporate system footer */}
      <footer className="shrink-0 mt-8 border-t border-white/10 pt-4 text-center">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
          Terminal Node: {PORTAL_SYSTEM_INFO.terminalCode} | Encryption: {PORTAL_SYSTEM_INFO.encryption} | {PORTAL_SYSTEM_INFO.portalYear} • {PORTAL_SYSTEM_INFO.adminId} • Iraq Digital Gateway
        </p>
      </footer>
    </div>
  );
}
