import React, { useState } from 'react';
import { UserSubscription, Language } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Users, 
  Search, 
  QrCode, 
  Copy, 
  Check, 
  RefreshCw, 
  PlusCircle, 
  Ban, 
  UserCheck, 
  ExternalLink,
  Shield,
  Send,
  Zap
} from 'lucide-react';

interface UsersViewProps {
  subscriptions: UserSubscription[];
  onUpdateSubscription: (updated: UserSubscription) => void;
  lang: Language;
}

export const UsersView: React.FC<UsersViewProps> = ({
  subscriptions,
  onUpdateSubscription,
  lang
}) => {
  const isFa = lang === 'fa';

  const [search, setSearch] = useState('');
  const [selectedSub, setSelectedSub] = useState<UserSubscription | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredSubs = subscriptions.filter(s => 
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.telegramId.includes(search)
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddVolume = (sub: UserSubscription, extraGb: number) => {
    const updated = {
      ...sub,
      totalTrafficGb: sub.totalTrafficGb + extraGb,
      status: 'active' as const
    };
    onUpdateSubscription(updated);
  };

  const handleToggleStatus = (sub: UserSubscription) => {
    const newStatus = sub.status === 'active' ? 'disabled' : 'active';
    onUpdateSubscription({ ...sub, status: newStatus as any });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>{isFa ? 'مدیریت کاربران و اشتراک‌های فعال' : 'Users & Active Subscriptions'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFa 
              ? 'مشاهده حجم مصرفی، لینک‌های ساب‌اسکریپشن، QR Code، تمدید و تغییر حجم' 
              : 'Search subscribers, view subscription links, QR codes, add traffic & renew'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isFa ? 'جستجو بر اساس یوزرنیم یا آیدی...' : 'Search username or Telegram ID...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="p-3.5">{isFa ? 'کاربر تلگرام' : 'Telegram User'}</th>
                <th className="p-3.5">{isFa ? 'پلن خریداری شده' : 'Subscribed Plan'}</th>
                <th className="p-3.5">{isFa ? 'حجم مصرفی / کل' : 'Used / Total Traffic'}</th>
                <th className="p-3.5">{isFa ? 'تاریخ انقضا' : 'Expiry Date'}</th>
                <th className="p-3.5">{isFa ? 'وضعیت' : 'Status'}</th>
                <th className="p-3.5 text-center">{isFa ? 'ساب‌اسکریپشن & QR' : 'Sub Link & QR'}</th>
                <th className="p-3.5 text-center">{isFa ? 'عملیات سریع' : 'Actions'}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filteredSubs.map((sub) => {
                const percentUsed = Math.min(100, Math.round((sub.usedTrafficGb / sub.totalTrafficGb) * 100));

                return (
                  <tr key={sub.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white">@{sub.username}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>{sub.fullName}</span>
                        <span className="font-mono text-slate-500">({sub.telegramId})</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-200">
                      <span className="font-medium">{isFa ? sub.packageNameFa : sub.packageNameEn}</span>
                    </td>

                    <td className="p-3.5 w-44">
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="text-slate-300 font-bold">{sub.usedTrafficGb} GB</span>
                        <span className="text-slate-500">/ {sub.totalTrafficGb} GB</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${percentUsed > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                          style={{ width: `${percentUsed}%` }}
                        />
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-slate-300">
                      {sub.expireDate}
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        sub.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : sub.status === 'expired'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {sub.status === 'active' ? (isFa ? 'فعال' : 'Active') : sub.status === 'expired' ? (isFa ? 'منقضی' : 'Expired') : (isFa ? 'مسدود' : 'Disabled')}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          setSelectedSub(sub);
                          setShowQrModal(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{isFa ? 'نمایش QR Code' : 'QR & Configs'}</span>
                      </button>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleAddVolume(sub, 10)}
                          className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium border border-slate-700/60"
                          title={isFa ? 'افزودن ۱۰ گیگ ترافیک' : 'Add +10GB Traffic'}
                        >
                          +10GB
                        </button>

                        <button
                          onClick={() => handleToggleStatus(sub)}
                          className={`p-1.5 rounded-md text-[11px] ${
                            sub.status === 'active'
                              ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                          title={sub.status === 'active' ? (isFa ? 'غیرفعال‌سازی کاربر' : 'Disable') : (isFa ? 'فعال‌سازی کاربر' : 'Enable')}
                        >
                          {sub.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code & Configs Modal */}
      {showQrModal && selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {isFa ? 'لینک ساب‌اسکریپشن و QR Code' : 'Subscription Link & QR Code'}
                </h3>
              </div>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* QR Code Card */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div className="p-3 bg-white rounded-xl shadow-lg">
                <QRCodeSVG value={selectedSub.subUrl} size={180} level="M" />
              </div>
              <p className="text-xs text-slate-400 text-center">
                {isFa 
                  ? 'قابلیت اسکن مستقیم در نرم‌افزارهای V2rayNG، v2rayN، Streisand و Shadowrocket' 
                  : 'Scan directly in V2rayNG, Streisand, Shadowrocket, or NekoBox.'}
              </p>
            </div>

            {/* Sub URL */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400 block font-medium">
                {isFa ? 'لینک هوشمند ساب‌اسکریپشن (Subscription URL):' : 'Subscription URL:'}
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                <input
                  type="text"
                  readOnly
                  value={selectedSub.subUrl}
                  className="w-full bg-transparent text-cyan-300 font-mono text-xs focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(selectedSub.subUrl)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (isFa ? 'کپی شد' : 'Copied') : (isFa ? 'کپی' : 'Copy')}</span>
                </button>
              </div>
            </div>

            {/* Individual VLESS Config Links */}
            <div className="space-y-2 text-xs">
              <label className="text-slate-400 block font-medium">
                {isFa ? 'کانفیگ‌های مجزا (VLESS / VMess / Trojan):' : 'Individual Config Links:'}
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedSub.configLinks.map((link, idx) => (
                  <div key={idx} className="p-2 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between font-mono text-[11px] text-slate-300">
                    <span className="truncate max-w-xs">{link}</span>
                    <button
                      onClick={() => handleCopy(link)}
                      className="text-indigo-400 hover:text-indigo-300 shrink-0 font-sans"
                    >
                      {isFa ? 'کپی' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                {isFa ? 'بستن' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
