import React from 'react';
import { Language, ActiveTab } from '../types';
import { 
  Bot, 
  Globe, 
  Server, 
  ShieldCheck, 
  Languages, 
  Terminal, 
  TerminalSquare, 
  BellRing,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  botStatus: 'online' | 'offline';
  pendingOrdersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  activeTab,
  setActiveTab,
  botStatus,
  pendingOrdersCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand & Bot Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-wide text-white font-sans">
                {lang === 'fa' ? 'مدیریت ربات و فروشگاه V2Shop' : 'V2Shop Admin Console'}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3 h-3" /> v2.4 Pro
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${botStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                {botStatus === 'online' 
                  ? (lang === 'fa' ? 'ربات تلگرام متصل است' : 'Bot Connected') 
                  : (lang === 'fa' ? 'ربات غیرفعال است' : 'Bot Offline')}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 truncate max-w-[140px] sm:max-w-xs">
                @V2ShopVPNBot
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Terminal Deployment Tab Button */}
          <button
            onClick={() => setActiveTab('vps-installer')}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'vps-installer'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            <TerminalSquare className="w-4 h-4" />
            <span>{lang === 'fa' ? 'کد نصب تک خطی VPS' : '1-Click VPS Deploy'}</span>
          </button>

          {/* Quick Bot Simulator Button */}
          <button
            onClick={() => setActiveTab('bot-simulator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'bot-simulator'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'fa' ? 'شبیه‌ساز ربات' : 'Bot Simulator'}</span>
          </button>

          {/* Pending Orders Notification Bell */}
          <button
            onClick={() => setActiveTab('orders')}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
            title={lang === 'fa' ? 'سفارشات منتظر تایید' : 'Pending Orders'}
          >
            <BellRing className="w-4 h-4" />
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 text-xs font-medium transition-colors"
            title="تغییر زبان / Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <span className="uppercase">{lang === 'fa' ? 'EN' : 'فا'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
