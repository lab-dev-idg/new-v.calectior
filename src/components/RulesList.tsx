import React, { useState } from 'react';
import { Search, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, XCircle } from 'lucide-react';
import { LanguageType, TranslationType } from '../utils/translations';
import { CustomsLists } from '../types';

interface RulesListProps {
  lists: CustomsLists;
  lang: LanguageType;
  t: TranslationType;
}

export default function RulesList({ lists, lang, t }: RulesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filterList = (items: string[]) => {
    if (!searchTerm.trim()) return items;
    return items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const allowedFiltered = filterList(lists.allowed);
  const restrictedFiltered = filterList(lists.restricted);
  const prohibitedFiltered = filterList(lists.prohibited);

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-idg-gold" />
            {t.rules.title}
          </h2>
          <p className="text-xs text-slate-400">{t.lawCaption}</p>
        </div>

        {/* Dynamic search bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 text-slate-500 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder={t.rules.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input pl-11 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Grid panels of Allowed, Restricted, Prohibited Goods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Allowed class */}
        <div className="glass-card p-5 border-t-4 border-t-emerald-500 hover:shadow-emerald-550/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-base text-slate-100">{t.rules.allowed}</h3>
            <span className="ml-auto bg-emerald-500/10 text-emerald-400 text-xs font-mono px-2 py-0.5 rounded-full">
              {allowedFiltered.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-normal mb-2">{t.rules.allowedDesc}</p>
          
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[250px] pr-1">
            {allowedFiltered.length > 0 ? (
              allowedFiltered.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-500/10 transition-colors"
                >
                  {item}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic mt-4 w-full text-center">
                {lang === 'ku' ? 'هیچ کاڵایەک نەدۆزرایەوە' : 'No items matching filter'}
              </p>
            )}
          </div>
        </div>

        {/* Restricted class */}
        <div className="glass-card p-5 border-t-4 border-t-amber-500 hover:shadow-amber-550/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-100">{t.rules.restricted}</h3>
            <span className="ml-auto bg-amber-500/10 text-amber-400 text-xs font-mono px-2 py-0.5 rounded-full">
              {restrictedFiltered.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-normal mb-2">{t.rules.restrictedDesc}</p>
          
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[250px] pr-1">
            {restrictedFiltered.length > 0 ? (
              restrictedFiltered.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-amber-500/5 text-amber-400 border border-amber-500/20 text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-amber-500/10 transition-colors"
                >
                  {item}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic mt-4 w-full text-center">
                {lang === 'ku' ? 'هیچ کاڵایەک نەدۆزرایەوە' : 'No items matching filter'}
              </p>
            )}
          </div>
        </div>

        {/* Prohibited class */}
        <div className="glass-card p-5 border-t-4 border-t-red-500 hover:shadow-red-550/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-base text-slate-100">{t.rules.prohibited}</h3>
            <span className="ml-auto bg-red-500/10 text-red-400 text-xs font-mono px-2 py-0.5 rounded-full">
              {prohibitedFiltered.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-normal mb-2">{t.rules.prohibitedDesc}</p>
          
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[250px] pr-1">
            {prohibitedFiltered.length > 0 ? (
              prohibitedFiltered.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-red-500/5 text-red-400 border border-red-500/20 text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-red-500/10 transition-colors"
                >
                  {item}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic mt-4 w-full text-center">
                {lang === 'ku' ? 'هیچ کاڵایەک نەدۆزرایەوە' : 'No items matching filter'}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
