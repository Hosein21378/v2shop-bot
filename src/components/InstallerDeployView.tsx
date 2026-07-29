import React, { useState } from 'react';
import { BotSettings, Language } from '../types';
import { 
  generateInstallSh, 
  generateDockerCompose, 
  generatePythonBotCode, 
  generateOneLineCommand,
  generateReadmeMd 
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
  FolderGit2,
  BookOpen,
  Activity,
  RotateCw,
  FileText
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

  const [githubRepo, setGithubRepo] = useState('Hosein21378/v2shop-bot');
  const [activeCodeTab, setActiveCodeTab] = useState<'sh' | 'docker' | 'py' | 'env' | 'readme'>('readme');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const installShCode = generateInstallSh(settings, githubRepo);
  const dockerCode = generateDockerCompose();
  const pythonBotCode = generatePythonBotCode(settings);
  const readmeMdCode = generateReadmeMd(settings, githubRepo);
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

  const vpsCommands = [
    {
      titleFa: 'بررسی وضعیت آنلاین بودن ربات',
      titleEn: 'Check Bot Service Status',
      cmd: 'systemctl status v2shop-bot',
      key: 'cmd_status'
    },
    {
      titleFa: 'مشاهده لاگ‌های زنده ربات (خطایابی)',
      titleEn: 'Live Logs Stream',
      cmd: 'journalctl -u v2shop-bot -f -n 100',
      key: 'cmd_logs'
    },
    {
      titleFa: 'راه‌اندازی مجدد سرویس (Restart)',
      titleEn: 'Restart Bot Service',
      cmd: 'systemctl restart v2shop-bot',
      key: 'cmd_restart'
    },
    {
      titleFa: 'ویرایش فایل تنظیمات config.env',
      titleEn: 'Edit Environment Config',
      cmd: 'nano /opt/v2shop-bot/config.env',
      key: 'cmd_config'
    }
  ];

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            <span>{isFa ? 'راهنمای کامل بارگذاری فایل‌ها در گیت‌هاب شما' : 'Full GitHub File Upload Guide'}</span>
          </h3>
          <a
            href={`https://github.com/${githubRepo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>{isFa ? 'باز کردن ریپازیتوری شما در گیت‌هاب' : 'Open Your Repo'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {isFa 
            ? `ریپازیتوری https://github.com/${githubRepo} در حال حاضر خالی است. برای اینکه ربات آماده نصب گردد، فایل‌های زیر را طبق یکی از دو روش در گیت‌هاب خود اضافه کنید:`
            : `Your repository https://github.com/${githubRepo} is currently empty. Follow one of the options below to add the required files:`}
        </p>

        {/* Quick README.md Add Callout */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{isFa ? 'راهنمای کپی و قرار دادن دستورات در دکمه Add a README گیت‌هاب' : 'Add a README Button Instructions'}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isFa
                  ? 'در گیت‌هاب روی دکمه سبز رنگ "Add a README" یا "Create new file" کلیک کنید، متن زیر را کپی کرده و در صفحه گیت‌هاب پیست (Paste) و Commit نمایید:'
                  : 'Click the "Add a README" button in your GitHub repo, copy the text below, paste it into GitHub, and commit changes:'}
              </p>
            </div>
            <button
              onClick={() => handleCopy(readmeMdCode, 'quick_readme')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all shrink-0"
            >
              {copiedSection === 'quick_readme' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSection === 'quick_readme' ? (isFa ? 'محتوای README کپی شد!' : 'Copied!') : (isFa ? 'کپی کامل متن README.md' : 'Copy README.md Text')}</span>
            </button>
          </div>
        </div>

        {/* Option A: Web UI */}
        <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-4 space-y-3">
          <div className="text-xs font-bold text-indigo-300 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] flex items-center justify-center font-mono font-bold">روش ۱</span>
            <span>{isFa ? 'ساخت فایل‌ها مستقیماً در مرورگر (بدون نیاز به نرم‌افزار):' : 'Create Files Directly in Web Browser:'}</span>
          </div>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>
              {isFa ? 'وارد لینک ریپازیتوری شوید: ' : 'Open repo link: '}
              <a href={`https://github.com/${githubRepo}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-mono">https://github.com/{githubRepo}</a>
            </li>
            <li>
              {isFa ? 'روی دکمه ' : 'Click '}
              <strong className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Add file</strong>
              {isFa ? ' و سپس ' : ' then '}
              <strong className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Create new file</strong>
              {isFa ? ' کلیک کنید.' : '.'}
            </li>
            <li>
              {isFa ? 'نام فایل اول را ' : 'Name first file '}
              <code className="text-emerald-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded">README.md</code>
              {isFa ? ' بگذارید، متن تب README.md پایین را کپی کرده و در آن پیست کنید و Commit Changes بزنید.' : ' and paste the content from README.md tab below.'}
            </li>
            <li>
              {isFa ? 'مجدداً فایل دوم به نام ' : 'Repeat for second file '}
              <code className="text-emerald-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded">install.sh</code>
              {isFa ? ' بسازید و محتوای تب install.sh را کپی و ذخیره نمایید.' : '.'}
            </li>
            <li>
              {isFa ? 'فایل سوم ' : 'Third file '}
              <code className="text-emerald-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded">bot.py</code>
              {isFa ? ' و فایل چهارم ' : ' and fourth file '}
              <code className="text-emerald-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded">config.env</code>
              {isFa ? ' را نیز به همین ترتیب ایجاد کنید.' : '.'}
            </li>
          </ol>
        </div>

        {/* Option B: Git Terminal */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] flex items-center justify-center font-mono font-bold">روش ۲</span>
            <span>{isFa ? 'دستورات Git در ترمینال سیستم کامپیوتر یا سرور:' : 'Git CLI Terminal Commands:'}</span>
          </div>
          <div className="font-mono text-[11px] text-emerald-400 space-y-1 bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 dir-ltr text-left">
            <div className="text-slate-500 text-[10px]"># Execute in your local project folder:</div>
            <div>git init</div>
            <div>git add .</div>
            <div>git commit -m "Add V2Shop bot files and installer"</div>
            <div>git branch -M main</div>
            <div>git remote add origin https://github.com/{githubRepo}.git</div>
            <div>git push -u origin main</div>
          </div>
        </div>
      </div>

      {/* VPS Server Management Commands Cheat-Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>{isFa ? 'راهنمای کاربردی دستورات مدیریت سرور لینوکس (VPS Commands Cheat-Sheet)' : 'VPS Management Commands Cheat-Sheet'}</span>
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {isFa ? 'دستورات ضروری Terminal' : 'Terminal Commands'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vpsCommands.map((item) => (
            <div key={item.key} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">{isFa ? item.titleFa : item.titleEn}</div>
                <div className="font-mono text-xs text-emerald-400 mt-1 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800/80 truncate">
                  {item.cmd}
                </div>
              </div>
              <button
                onClick={() => handleCopy(item.cmd, item.key)}
                className="self-end px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
              >
                {copiedSection === item.key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === item.key ? (isFa ? 'کپی شد' : 'Copied') : (isFa ? 'کپی دستور' : 'Copy')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Source Files & README.md Code Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>{isFa ? 'سورس‌کدها و راهنمای README.md تولید شده جهت گیت‌هاب' : 'Generated Source Files & README.md'}</span>
          </h3>

          {/* Code Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveCodeTab('readme')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${activeCodeTab === 'readme' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <FileText className="w-3 h-3" />
              <span>README.md</span>
            </button>
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
              const content = activeCodeTab === 'readme' ? readmeMdCode : activeCodeTab === 'sh' ? installShCode : activeCodeTab === 'py' ? pythonBotCode : activeCodeTab === 'env' ? envCode : dockerCode;
              handleCopy(content, activeCodeTab);
            }}
            className="absolute top-3 right-3 rtl:left-3 rtl:right-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1 z-10 shadow-lg"
          >
            {copiedSection === activeCodeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === activeCodeTab ? (isFa ? 'کپی شد' : 'Copied') : (isFa ? 'کپی محتوای این فایل' : 'Copy File Content')}</span>
          </button>

          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed dir-ltr text-left">
            {activeCodeTab === 'readme' && readmeMdCode}
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
