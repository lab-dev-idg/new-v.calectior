import React, { useState } from 'react';
import AiAdvisor from '../components/AiAdvisor';
import { ShieldAlert, Terminal, CheckCircle2, Cpu, MessageSquare } from 'lucide-react';
import { LanguageType, TranslationType } from '../utils/translations';

interface AuditLogsPageProps {
  lang: LanguageType;
  t: TranslationType;
}

export default function AuditLogsPage({ lang, t }: AuditLogsPageProps) {
  const [mockLogs] = useState([
    { id: 1, action: "CBI Exchange Rate Verified", detail: "Loaded official CBI target at 1,300 IQD/USD", user: "SYSTEM_DAEMON", time: "Just now", status: "SUCCESS" },
    { id: 2, action: "Tariff Baseline Re-indexed", detail: "Standard rates set at 5% baseline, Lux set at 20%", user: PORTAL_ADMIN_HEX(), time: "15 minutes ago", status: "SUCCESS" },
    { id: 3, action: "National Protective Check", detail: "Verified national trade safeguard parameters status", user: "SYSTEM_DAEMON", time: "1 hour ago", status: "WARNING" },
    { id: 4, action: "Blacklist commodities index pull", detail: "Pulled 3 restricted subcategories from trade database", user: "BORDER_EXCISE_01", time: "3 hours ago", status: "SUCCESS" }
  ]);

  function PORTAL_ADMIN_HEX() {
    return "ADMIN_8820";
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Page Header */}
      <div className="glass-card p-4 flex flex-col justify-center border-l-4 border-idg-gold">
        <h2 className="text-base font-bold text-idg-gold uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-idg-gold" />
          <span>{lang === 'ku' ? 'تۆمارەکانی وردبینی و ڕاوێژکاری زیرەک' : 'Regulatory Auditing & Legal Advisor'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ku' ? 'بینیینی دوایین کردارەکانی گۆڕینی سیستم لەگەڵ پرسیارکردن لە یاسانی نوێی ٢٠١٠' : 'Review live security audit activities alongside interactive questions based on Custom Code No. 22.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left component: AI Legal Advisor Chat */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="glass-card p-4 flex-1 flex flex-col justify-between">
            <AiAdvisor lang={lang} t={t} />
          </div>
        </div>

        {/* Right component: System Security Logs events */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-card p-5 flex flex-col h-full justify-between">
            <div>
              <div className="border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#D4AF37]" />
                  <span>{lang === 'ku' ? 'تۆماری ئاسایشی سنوور' : 'EXCISE SYSTEM AUDIT LOG'}</span>
                </h3>
                <span className="text-[10px] uppercase bg-emerald-950/40 border border-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg font-mono">
                  SECURED GCM
                </span>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {mockLogs.map((log) => (
                  <div key={log.id} className="bg-slate-950/40 border border-white/5 hover:border-white/10 p-3.5 rounded-xl transition flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-200">{log.action}</span>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold ${log.status === 'SUCCESS' ? 'bg-emerald-950/50 text-emerald-400' : 'bg-yellow-950/40 text-yellow-500'}`}>
                        {log.status}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">{log.detail}</p>
                    
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-white/5">
                      <span>By: {log.user}</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex gap-3 text-[10px] text-slate-500 items-center justify-center italic text-center">
              <Cpu className="w-4.5 h-4.5 text-[#D4AF37] animate-pulse shrink-0" />
              <span>{lang === 'ku' ? 'وردبینیکردن بە فەرمی ئەنجامدراوە بە واژۆی دیجیتاڵی' : 'Decentralized logs are signed with system public keys for transparent auditing.'}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
