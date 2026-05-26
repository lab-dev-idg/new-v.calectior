import React from 'react';
import { AreaChart, TrendingUp, DollarSign, Activity, ListChecks, ArrowDownRight, ArrowUpRight, Scale, Trash2 } from 'lucide-react';
import { LanguageType, TranslationType } from '../utils/translations';
import { SystemSettings, CustomsLists } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SystemAnalyticsProps {
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

export default function SystemAnalytics({ settings, lists, lang, t, records, clearRecords }: SystemAnalyticsProps) {
  const currencySpread = settings.currency.market - settings.currency.official;
  const spreadPercentage = ((currencySpread) / settings.currency.official) * 100;

  const totalItemsCount = lists.allowed.length + lists.restricted.length + lists.prohibited.length;

  const chartData = React.useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateString = d.toLocaleDateString(lang === 'ku' ? 'ku-IQ' : 'en-US', { month: 'short', day: 'numeric' });
      
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      
      let sumTax = 0;
      records.forEach(rec => {
        let recTime = 0;
        const tsMatch = rec.id.match(/^rec-(\d+)$/);
        if (tsMatch) {
          recTime = Number(tsMatch[1]);
        } else {
          recTime = new Date(rec.timestamp).getTime();
        }
        
        if (recTime >= dayStart && recTime < dayEnd) {
          sumTax += rec.tax;
        }
      });
      
      data.push({
        date: dateString,
        tax: Number(sumTax.toFixed(2)),
      });
    }
    return data;
  }, [records, lang]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active rates */}
        <div className="glass-card p-4 flex gap-4 items-center">
          <div className="w-10 h-10 bg-idg-navy/50 border border-white/10 rounded-xl flex items-center justify-center text-idg-gold">
            <Scale className="w-5 h-5 text-idg-gold" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.analytics.stats.activeRules}</span>
            <span className="text-sm font-bold mt-0.5">ئاسایی: {settings.customs_rates.ئاسایی}%</span>
            <span className="text-[10px] text-slate-500 font-mono">لوکس: {settings.customs_rates.لوکس}% / پیشەسازی: {settings.customs_rates.پیشەسازی}%</span>
          </div>
        </div>

        {/* Card 2: Currency gap */}
        <div className="glass-card p-4 flex gap-4 items-center">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${currencySpread > 150 ? 'bg-amber-950/40 border-amber-500/20 text-amber-500' : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-500'}`}>
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.analytics.stats.officialVsMarket}</span>
            <span className="text-sm font-bold mt-0.5 font-mono">+{Math.round(currencySpread)} IQD</span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
              Spread {spreadPercentage.toFixed(1)}% {currencySpread > 150 ? <ArrowUpRight className="w-3 h-3 text-amber-500 inline" /> : <ArrowDownRight className="w-3 h-3 text-emerald-500 inline" />}
            </span>
          </div>
        </div>

        {/* Card 3: Protection surtax status */}
        <div className="glass-card p-4 flex gap-4 items-center">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${settings.protection.enabled ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' : 'bg-slate-950/60 border-white/5 text-slate-500'}`}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.analytics.stats.protectionTariff}</span>
            <span className="text-sm font-bold mt-0.5">{settings.protection.enabled ? `${settings.protection.rate}% Active` : 'Disabled'}</span>
            <span className="text-[10px] text-slate-500">یاسای پاراستنی پیشەسازی عێراق</span>
          </div>
        </div>

        {/* Card 4: Items counters */}
        <div className="glass-card p-4 flex gap-4 items-center">
          <div className="w-10 h-10 bg-idg-navy/50 border border-white/10 rounded-xl flex items-center justify-center text-idg-gold">
            <ListChecks className="w-5 h-5 text-idg-gold" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.analytics.stats.itemsCount}</span>
            <span className="text-sm font-bold mt-0.5 font-mono">{totalItemsCount} Commodities</span>
            <span className="text-[10px] text-slate-500">نوێکراوەتەوە بەپێی دەسەڵاتی Admin</span>
          </div>
        </div>

      </div>

      {/* Main core visualization and histories row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Custom luxury SVG tax comparison charts */}
        <div className="lg:col-span-5 glass-card p-5 flex flex-col justify-between">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <AreaChart className="w-4.5 h-4.5 text-idg-gold" />
              {t.analytics.chartTitle}
            </h3>
          </div>

          {/* High polished SVG Chart representation */}
          <div className="h-[210px] my-4 flex items-end justify-between px-2 pt-6 relative border-b border-white/10 border-l border-white/10 font-mono text-[10px] text-slate-500">
            
            {/* Grid references background */}
            <div className="absolute inset-x-0 bottom-1/5 border-t border-white/5" />
            <div className="absolute inset-x-0 bottom-2/5 border-t border-white/5" />
            <div className="absolute inset-x-0 bottom-3/5 border-t border-white/5" />
            <div className="absolute inset-x-0 bottom-4/5 border-t border-white/5" />

            <div className="flex flex-col items-center gap-3 w-1/4 group z-10">
              <div className="w-full max-w-[40px] bg-gradient-to-t from-idg-navy to-idg-gold hover:to-yellow-400 rounded-t-lg transition-all duration-500 relative flex justify-center items-end"
                style={{ height: `${settings.customs_rates.ئاسایی * 8}px`, minHeight: '16px' }}
              >
                <span className="absolute -top-6 text-slate-300 font-black text-xs font-mono">{settings.customs_rates.ئاسایی}%</span>
              </div>
              <span className="text-[10px] font-sans font-semibold text-slate-405 text-center truncate w-full">{t.calculator.categoryOptions.ئاسایی.split(' ')[0]}</span>
            </div>

            <div className="flex flex-col items-center gap-3 w-1/4 group z-10">
              <div className="w-full max-w-[40px] bg-gradient-to-t from-idg-navy to-idg-gold hover:to-yellow-400 rounded-t-lg transition-all duration-500 relative flex justify-center items-end"
                style={{ height: `${settings.customs_rates.پیشەسازی * 8}px`, minHeight: '16px' }}
              >
                <span className="absolute -top-6 text-slate-300 font-black text-xs font-mono">{settings.customs_rates.پیشەسازی}%</span>
              </div>
              <span className="text-[10px] font-sans font-semibold text-slate-405 text-center truncate w-full">{t.calculator.categoryOptions.پیشەسازی.split(' ')[0]}</span>
            </div>

            <div className="flex flex-col items-center gap-3 w-1/4 group z-10">
              <div className="w-full max-w-[40px] bg-gradient-to-t from-idg-navy to-red-500 hover:to-red-400 rounded-t-lg transition-all duration-500 relative flex justify-center items-end"
                style={{ height: `${settings.customs_rates.لوکس * 8}px`, minHeight: '16px' }}
              >
                <span className="absolute -top-6 text-slate-300 font-black text-xs font-mono">{settings.customs_rates.لوکس}%</span>
              </div>
              <span className="text-[10px] font-sans font-semibold text-slate-405 text-center truncate w-full">{t.calculator.categoryOptions.لوکس.split(' ')[0]}</span>
            </div>

            <div className="flex flex-col items-center gap-3 w-1/4 group z-10">
              <div className="w-full max-w-[40px] bg-gradient-to-t from-slate-900 to-sky-400 hover:to-sky-300 rounded-t-lg transition-all duration-500 relative flex justify-center items-end"
                style={{ height: `${(settings.protection.enabled ? settings.protection.rate : 0) * 8}px`, minHeight: '1px' }}
              >
                <span className="absolute -top-6 text-slate-300 font-black text-xs font-mono">{settings.protection.enabled ? settings.protection.rate : 0}%</span>
              </div>
              <span className="text-[10px] font-sans font-semibold text-sky-400 text-center truncate w-full">پاراستن</span>
            </div>

          </div>

          <p className="text-[9.5px] text-slate-500 text-center italic mt-2">
            * بارەکانی گومرکی سەر سنووری عێراق گۆڕانکاریان بەسەردا دێت بەپێی مەنشەئی کاڵاکان.
          </p>
        </div>

        {/* Live records logger right */}
        <div className="lg:col-span-7 glass-card p-5 flex flex-col justify-between">
          <div className="border-b border-white/5 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-idg-gold" />
              {t.analytics.recentTitle}
            </h3>
            {records.length > 0 && (
              <button
                type="button"
                onClick={clearRecords}
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-bold cursor-pointer hover:underline transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'ku' ? 'سڕینەوەی مێژوو' : 'Clear History'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[220px] mt-4 space-y-2 pr-1 font-sans">
            {records.length > 0 ? (
              records.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-slate-950/40 p-3.5 rounded-xl border border-white/5 flex justify-between items-center hover:border-slate-800 transition-all duration-200"
                >
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-xs font-semibold text-slate-200">
                      بار: <span className="text-idg-gold font-bold">{rec.category}</span> • بەها: <span className="font-mono text-emerald-400 font-bold">${rec.value.toLocaleString()}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{rec.timestamp}</span>
                  </div>

                  <div className="flex flex-col gap-0.5 text-left font-mono">
                    <span className="text-xs font-bold text-slate-105">${rec.total.toFixed(2)} USD</span>
                    <span className="text-[10px] text-slate-500">باج: ${rec.tax.toFixed(2)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center py-10 gap-3 text-slate-500">
                <TrendingUp className="w-8 h-8 text-slate-650 opacity-40 animate-pulse" />
                <p className="text-xs font-bold italic leading-relaxed">{t.analytics.noRecords}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 7-Day Customs Tax Trend (Recharts Line Chart) */}
      <div className="glass-card p-5 flex flex-col gap-4">
        <div className="border-b border-white/5 pb-3 flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#D4AF37] flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-[#D4AF37]" />
            <span>{lang === 'ku' ? 'ڕەوتی باجی گومرگی لە ٧ رۆژی ڕابردوودا' : '7-Day Customs Tax Trend (USD)'}</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            {lang === 'ku' ? 'سیستەمی فەرمی دەروازە' : 'Official Portal Surcharges Timeline'}
          </span>
        </div>
        
        <div className="h-[240px] w-full mt-2 font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10}
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(212, 175, 87, 0.2)', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'sans-serif'
                }} 
                formatter={(value) => [`$${value}`, lang === 'ku' ? 'کۆی باج' : 'Customs Tax']}
              />
              <Line 
                type="monotone" 
                dataKey="tax" 
                stroke="#D4AF37" 
                strokeWidth={3}
                dot={{ r: 4, stroke: '#D4AF37', strokeWidth: 1, fill: '#0F172A' }}
                activeDot={{ r: 6, stroke: '#e6c24c', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
