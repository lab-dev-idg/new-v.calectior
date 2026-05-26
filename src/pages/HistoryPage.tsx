import React, { useState } from 'react';
import { History, Trash2, Search, FileDown, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { LanguageType, TranslationType } from '../utils/translations';

interface HistoryPageProps {
  records: Array<{
    id: string;
    timestamp: string;
    category: string;
    value: number;
    tax: number;
    total: number;
  }>;
  clearRecords: () => void;
  lang: LanguageType;
  t: TranslationType;
  onDeleteRecord?: (id: string) => void;
}

export default function HistoryPage({
  records,
  clearRecords,
  lang,
  t,
  onDeleteRecord
}: HistoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredRecords = records.filter(rec => {
    const valueMatch = rec.value.toString().includes(searchTerm) || 
                       rec.total.toString().includes(searchTerm) ||
                       rec.category.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = filterCategory === 'all' || rec.category === filterCategory;
    return valueMatch && categoryMatch;
  });

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Page header */}
      <div className="glass-card p-4 flex flex-col justify-center border-l-4 border-idg-gold">
        <h2 className="text-base font-bold text-idg-gold uppercase tracking-wider flex items-center gap-2">
          <History className="w-5 h-5" />
          <span>{lang === 'ku' ? 'تۆمار و هێڵکاری خەمڵاندنەکان' : 'Gateway Estimation Ledger'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ku' ? 'تۆماری سەرجەم ئەو بارانەی پێشتر کیلکولەیت کراون بە گومرگی فەرمیەوە لێرەیە' : 'Comprehensive archive of pre-calculated customs entries, including declared sums and total taxes.'}
        </p>
      </div>

      {/* Control Tools panel */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search bar inputs */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'ku' ? 'گەڕان لە بەها یان مێژوو...' : 'Search value or category...'}
              className="glass-input pl-10 text-xs py-2 w-full"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="glass-input text-xs py-2.5 max-w-[150px] cursor-pointer"
          >
            <option value="all">{lang === 'ku' ? 'گشت جۆرەکان' : 'All Classes'}</option>
            <option value="ئاسایی">{lang === 'ku' ? 'ئاسایی' : 'Standard'}</option>
            <option value="لوکس">{lang === 'ku' ? 'لوکس' : 'Luxury'}</option>
            <option value="پیشەسازی">{lang === 'ku' ? 'پیشەسازی' : 'Industrial'}</option>
          </select>
        </div>

        {/* Clear and export options */}
        <div className="flex items-center gap-2 shrink-0">
          {records.length > 0 && (
            <button
              onClick={clearRecords}
              type="button"
              className="bg-rose-950/40 text-rose-450 border border-rose-900/40 hover:bg-rose-900/30 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>{lang === 'ku' ? 'سڕینەوەی هەموو تۆمارەکان' : 'Wipe Estimation History'}</span>
            </button>
          )}
        </div>

      </div>

      {/* Tables representation */}
      <div className="glass-card overflow-hidden">
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right md:text-left text-xs font-sans">
              <thead className="bg-white/5 uppercase tracking-wider text-slate-400 text-[10px] font-bold border-b border-white/5">
                <tr>
                  <th className="p-4">{lang === 'ku' ? 'پۆلێنکردنی کاڵا' : 'Cargo Category'}</th>
                  <th className="p-4">{lang === 'ku' ? 'بەهای ڕاگەیەندراو (USD)' : 'Declared FOB (USD)'}</th>
                  <th className="p-4">{lang === 'ku' ? 'باجی گومرگی (USD)' : 'Duties Surcharge'}</th>
                  <th className="p-4">{lang === 'ku' ? 'کۆی گشتی (USD)' : 'Total Cost (USD)'}</th>
                  <th className="p-4 text-center">{lang === 'ku' ? 'مێژوو و کات' : 'Calculation Date'}</th>
                  <th className="p-4 text-center">{lang === 'ku' ? 'کردارەکان' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/2 transition">
                    <td className="p-4">
                      <span className={`font-sans text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        rec.category === 'ئاسایی' ? 'bg-slate-800 text-slate-300' :
                        rec.category === 'لوکس' ? 'bg-rose-950/50 text-rose-400 border border-rose-500/10' :
                        'bg-amber-950/50 text-amber-400 border border-amber-500/10'
                      }`}>
                        {rec.category === 'ئاسایی' ? 'Standard (ئاسایی)' :
                         rec.category === 'لوکس' ? 'Luxury (لوکس)' : 'Industrial (پیشەسازی)'}
                      </span>
                    </td>
                    <td className="p-4 text-emerald-400 font-bold">${rec.value.toLocaleString()}</td>
                    <td className="p-4 text-slate-400">${rec.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-idg-gold font-bold">${rec.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-center text-slate-500 text-[10px]">{rec.timestamp}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onDeleteRecord && onDeleteRecord(rec.id)}
                        type="button"
                        className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-white/5 cursor-pointer transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <AlertCircle className="w-10 h-10 opacity-30 text-idg-gold animate-bounce" />
            <p className="text-sm font-semibold italic">{lang === 'ku' ? 'هیچ تۆمارێک نەدۆزرایەوە!' : 'No historical records matched your query.'}</p>
          </div>
        )}
      </div>

    </div>
  );
}
