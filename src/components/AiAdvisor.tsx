import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, CornerDownLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { LanguageType, TranslationType } from '../utils/translations';
import { ChatMessage } from '../types';

interface AiAdvisorProps {
  lang: LanguageType;
  t: TranslationType;
}

export default function AiAdvisor({ lang, t }: AiAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      role: "model",
      text: t.chat.welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const endOfChatRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll bottom
  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || sending) return;

    setErrorStatus(null);
    const userMsgId = `user-msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setSending(true);

    try {
      // Package query history for conversational state
      // Sliced to last 6 messages to keep things extremely fast and optimized
      const chatHistory = messages
        .filter(msg => msg.id !== "initial-welcome")
        .slice(-6)
        .map(msg => ({
          role: msg.role,
          text: msg.text,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed with server status ${res.status}`);
      }

      const responseData = await res.json();
      const modelMessage: ChatMessage = {
        id: `model-msg-${Date.now()}`,
        role: 'model',
        text: responseData.text || "ببورە، کێشەیەک ڕوویدا لە بارکردنی قسەکان.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      console.error("❌ Chat proxy error:", err);
      setErrorStatus(err.message || "Network exception");

      // Robust fallback response indicating connection status (so user is guaranteed a polished experience)
      const errFallbackMessage: ChatMessage = {
        id: `model-msg-err-${Date.now()}`,
        role: 'model',
        text: lang === 'ku'
          ? "ببورە، پەیوەندی بە دەوازەی فەرمی گومرک پچڕاوە لە ئێستادا. دەتوانیت لە ڕێگەی لاپەڕەی کیلکۆلایت تێچووەکە بە فەرمی هەژمار بکەیت یان دواتر تاقی بکەرەوە."
          : "Server connection timed out. Detailed calculations are still active on the main dashboard tab. Please try again after verifying your node environment status.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errFallbackMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-230px)] min-h-[500px]">
      
      {/* Suggestions panel left */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="glass-card p-5 h-full flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-base text-idg-gold flex items-center gap-2 border-b border-white/5 pb-2">
              <Sparkles className="w-4.5 h-4.5 text-idg-gold fill-idg-gold/10" />
              {t.chat.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">{t.chat.subtitle}</p>
          </div>

          <div className="flex flex-col gap-2.5 my-auto">
            {t.chat.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(suggestion)}
                className="w-full text-right bg-slate-950/40 hover:bg-slate-900/85 border border-white/5 hover:border-idg-gold/30 p-3.5 rounded-xl text-xs text-slate-300 font-medium transition-all duration-200 active:scale-[0.99] flex items-center justify-between gap-3 group text-right"
              >
                <span className="flex-1 text-right leading-relaxed">{suggestion}</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-slate-600 group-hover:text-idg-gold transition-colors shrink-0" />
              </button>
            ))}
          </div>

          <div className="bg-slate-950/20 p-3 rounded-xl border border-white/5 text-[10.5px] text-slate-500 leading-normal">
            {lang === 'ku'
              ? "یاریدەدەری یەدەگی ژیری حیسابکار لەسەر بنەمای بەشە فەرمییەکانی گومرکی و فەرمانی دەروازەیی ١٦٤ کار دەکات."
              : "Calculations and AI inputs utilize localized indexing regarding Iraq's Customs Decree No. 164 of border management."}
          </div>
        </div>
      </div>

      {/* Main chat window right */}
      <div className="lg:col-span-8 glass-card p-4 flex flex-col justify-between h-full relative overflow-hidden">
        
        {/* Messages box window */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 select-text">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full border shrink-0 flex items-center justify-center shadow-md ${
                  msg.role === 'user'
                    ? 'bg-idg-gold text-idg-navy border-idg-gold/20'
                    : 'bg-idg-navy text-idg-gold border-white/10'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-idg-gold" />
                )}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-idg-gold text-idg-navy rounded-tr-none font-medium'
                      : 'bg-slate-950/60 text-slate-200 border border-white/5 rounded-tl-none font-sans'
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 px-1 font-mono">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex gap-3 max-w-[80%] mr-auto text-left">
              <div className="w-8 h-8 rounded-full bg-idg-navy border border-white/10 shrink-0 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-idg-gold animate-bounce" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="px-4 py-3 bg-slate-950/60 border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-idg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-idg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-idg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={endOfChatRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleFormSubmit} className="relative mt-auto pt-2 border-t border-white/5 flex gap-2">
          <input
            type="text"
            required
            disabled={sending}
            placeholder={t.chat.inputPlaceholder}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="glass-input pl-4 pr-12 py-3 text-xs w-full font-sans"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className={`cursor-pointer absolute right-2.5 top-4.5 rounded-lg p-2 transition-all shrink-0 ${
              inputMessage.trim() && !sending
                ? 'bg-idg-gold text-idg-navy hover:scale-105 active:scale-95'
                : 'bg-slate-950 text-slate-600 border border-white/5'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
