import React, { useState } from 'react';
import { BotSettings, Language } from '../types';
import { 
  generateInstallSh, 
  generateDockerCompose, 
  generatePythonBotCode, 
  generateOneLineCommand 
} from '../utils/scriptGenerator';
import { 
  Terminal, 
  Copy, 
  Check, 
  Github, 
  Server, 
  Download, 
  CheckCircle2, 
  Code2, 
  ExternalLink,
  ShieldAlert,
  Zap,
  FolderGit2
} from 'lucide-react';

interface InstallerDeployViewProps {
  settings: BotSettings;
  lang: Language;
}

export const InstallerDeployView: React.FC<InstallerDeployViewProps> = ({
  settings,
  lang
}) => {
  const isFa = lang === 'fa';

  const [githubRepo, setGithubRepo] = useState('your-username/v2shop-bot');
  const [activeCodeTab, setActiveCodeTab] = useState<'sh' | 'docker' | 'py' | 'env'>('sh');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const installShCode = generateInstallSh(settings, githubRepo);
  const dockerCode = generateDockerCompose();
  const pythonBotCode = generatePythonBotCode(settings);
  const oneLiner = generateOneLineCommand(githubRepo);

  const envCode = `BOT_TOKEN="${settings.botToken}"
ADMIN_IDS="${settings.adminIds.join(',')}"
MANDATORY_CHANNEL="${settings.mandatoryChannel}"
SUPPORT_USERNAME="${settings.supportUsername}"
CARD_NUMBER="${settings.paymentGateways.cardToCard.cardNumber}"
CARD_HOLDER="${settings.paymentGateways.cardToCard.cardHolder}"
BANK_NAME="${settings.paymentGateways.cardToCard.bankName}"
ZARINPAL_MERCHANT="${settings.paymentGateways.zarinpal.merchantId}"
USDT_ADDRESS="${settings.paymentGateways.crypto.usdtAddress}"
DATABASE_URL="sqlite:///v2shop.db"
`;

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isFa ? 'نصب تک خطی روی VPS + گیت‌هاب' : '1-Click VPS Command & GitHub Deployment'}</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {isFa ? 'مرکز انتشار در گیت‌هاب و نصب خودکار روی سرور مجازی (VPS)' : 'GitHub Deployment & Auto VPS Installer'}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {isFa 
                ? 'کد دستوری تک‌خطی اختصاصی خود را کپی کنید و در ترمینال سرور مجازی (Ubuntu/Debian) وارد نمایید تا ربات تلگرام و تمام سرویس‌های آن بلافاصله نصب و فعال شوند.' 
                : 'Run a single bash command in your VPS terminal to fully deploy the Telegram bot and background services.'}
            </p>
          </div>
        </div>
      </div>

      {/* GitHub Repo Configuration Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <label className="block text-xs font-bold text-slate-200">
          {isFa ? 'آدرس ریپازیتوری گیت‌هاب شما (جهت ساخت اسکریپت curl):' : 'Your GitHub Repository Path:'}
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Github className="w-4 h-4 text-slate-500 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={githubRepo}
              onChange={e => setGithubRepo(e.target.value)}
              placeholder="username/repository-name"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-400 self-center">
            {isFa ? 'مثال: myaccount/v2shop-bot' : 'e.g. myaccount/v2shop-bot'}
          </span>
        </div>
      </div>

      {/* One Line Installation Command Box */}
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-3 shadow-lg shadow-emerald-500/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>{isFa ? 'کد دستوری تک خطی جهت نصب روی سرور مجازی (VPS Command)' : '1-Line Command to Run on VPS'}</span>
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            {isFa ? 'دستور رسمی' : 'Ready Command'}
          </span>
        </div>

        <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 font-mono text-xs text-emerald-400">
          <span className="truncate select-all">{oneLiner}</span>
          <button
            onClick={() => handleCopy(oneLiner, 'oneliner')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 transition-all shadow-md"
          >
            {copiedSection === 'oneliner' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'oneliner' ? (isFa ? 'کپی شد!' : 'Copied!') : (isFa ? 'کپی دستور' : 'Copy Command')}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            {isFa 
              ? 'این دستور به طور خودکار پکیج‌های Python، کتابخانه‌ها، فایل config.env و سرویس systemd را روی لینوکس پیکربندی می‌کند.' 
              : 'Automatically sets up Python, virtualenv, dependencies, config.env, and registers a systemd auto-restart service.'}
          </span>
        </p>
      </div>

      {/* GitHub Setup Instructions Steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-indigo-400" />
          <span>{isFa ? 'مراحل انتشار پروژه روی گیت‌هاب (GitHub Setup Guide)' : 'GitHub Deployment Guide'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] flex items-center justify-center font-mono">1</span>
              <span>{isFa ? 'ایجاد ریپازیتوری' : 'Create Repo'}</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {isFa ? 'در سایت github.com یک ریپازیتوری جدید به صورت Public ایجاد نمایید.' : 'Create a new public repository on github.com.'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] flex items-center justify-center font-mono">2</span>
              <span>{isFa ? 'آپلود سورس فایل‌ها' : 'Push Source Files'}</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {isFa ? 'فایل‌های install.sh و bot.py موجود در تب‌های زیر را در ریپازیتوری خود قرار دهید.' : 'Commit install.sh, bot.py, and requirements.txt to your main branch.'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] flex items-center justify-center font-mono">3</span>
              <span>{isFa ? 'اجرا روی VPS' : 'Run on VPS'}</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {isFa ? 'کد تک خطی بالا را در ترمینال سرور مجازی خود وارد و اجرا کنید.' : 'Paste the single command into your Ubuntu terminal.'}
            </p>
          </div>
        </div>

        {/* Git Commands Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1">
          <div className="text-slate-500 text-[10px]"># Git Commands to push code to GitHub:</div>
          <div>git init</div>
          <div>git add .</div>
          <div>git commit -m "Initial V2Shop Bot Commit"</div>
          <div>git branch -M main</div>
          <div>git remote add origin https://github.com/{githubRepo}.git</div>
          <div>git push -u origin main</div>
        </div>
      </div>

      {/* Generated Source Files Code Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>{isFa ? 'سورس‌کدهای تولید شده پروژه جهت آپلود در گیت‌هاب' : 'Generated Source Files Viewer'}</span>
          </h3>

          {/* Code Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveCodeTab('sh')}
              className={`px-3 py-1 rounded-lg transition-colors ${activeCodeTab === 'sh' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              install.sh
            </button>
            <button
              onClick={() => setActiveCodeTab('py')}
              className={`px-3 py-1 rounded-lg transition-colors ${activeCodeTab === 'py' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              bot.py
            </button>
            <button
              onClick={() => setActiveCodeTab('env')}
              className={`px-3 py-1 rounded-lg transition-colors ${activeCodeTab === 'env' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              config.env
            </button>
            <button
              onClick={() => setActiveCodeTab('docker')}
              className={`px-3 py-1 rounded-lg transition-colors ${activeCodeTab === 'docker' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              docker-compose
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="relative">
          <button
            onClick={() => {
              const content = activeCodeTab === 'sh' ? installShCode : activeCodeTab === 'py' ? pythonBotCode : activeCodeTab === 'env' ? envCode : dockerCode;
              handleCopy(content, activeCodeTab);
            }}
            className="absolute top-3 right-3 rtl:left-3 rtl:right-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1 z-10"
          >
            {copiedSection === activeCodeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === activeCodeTab ? (isFa ? 'کپی شد' : 'Copied') : (isFa ? 'کپی کد' : 'Copy Code')}</span>
          </button>

          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed dir-ltr text-left">
            {activeCodeTab === 'sh' && installShCode}
            {activeCodeTab === 'py' && pythonBotCode}
            {activeCodeTab === 'env' && envCode}
            {activeCodeTab === 'docker' && dockerCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
