import React from 'react';
import { ActiveTab, Language } from '../types';
import { 
  LayoutDashboard, 
  Bot, 
  Server, 
  ShoppingBag, 
  Users, 
  Receipt, 
  MessageSquareCode, 
  Terminal, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
  pendingOrdersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  pendingOrdersCount
}) => {
  const isFa = lang === 'fa';

  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      labelFa: 'داشبورد و آمار کلی',
      labelEn: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'bot-manager' as ActiveTab,
      labelFa: 'تنظیمات ربات تلگرام',
      labelEn: 'Telegram Bot Settings',
      icon: Bot,
      badge: null
    },
    {
      id: 'panels' as ActiveTab,
      labelFa: 'مدیریت پنل‌ها و سرورها',
      labelEn: 'VPN Panels & Nodes',
      icon: Server,
      badge: '4 Node'
    },
    {
      id: 'plans' as ActiveTab,
      labelFa: 'فروشگاه و پلن‌های اشتراک',
      labelEn: 'Shop & Package Plans',
      icon: ShoppingBag,
      badge: null
    },
    {
      id: 'users' as ActiveTab,
      labelFa: 'کاربران و اشتراک‌ها',
      labelEn: 'Users & Subscriptions',
      icon: Users,
      badge: null
    },
    {
      id: 'orders' as ActiveTab,
      labelFa: 'سفارشات و تایید فیش‌ها',
      labelEn: 'Orders & Receipts',
      icon: Receipt,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 'bot-simulator' as ActiveTab,
      labelFa: 'شبیه‌ساز زنده ربات (تست)',
      labelEn: 'Live Bot Simulator',
      icon: MessageSquareCode,
      badge: 'تست زنده',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'vps-installer' as ActiveTab,
      labelFa: 'نصب روی سرور VPS و گیت‌هاب',
      labelEn: 'VPS Deploy & GitHub',
      icon: Terminal,
      badge: 'کد تک خطی',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {isFa ? 'منوی اصلی سامانه' : 'Main Menu'}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{isFa ? item.labelFa : item.labelEn}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="mt-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-slate-300 font-medium">
          <span>{isFa ? 'پشتیبانی پروتکل‌ها' : 'Supported Protocols'}</span>
          <span className="text-cyan-400 font-mono text-[10px]">VLESS / X-UI</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {isFa 
            ? 'سازگار با مرزبان (Marzban)، 3X-UI و هیدیفای جهت ساخت خودکار کانفیگ Reality'
            : 'Compatible with Marzban, 3X-UI & Hiddify for automatic VLESS Reality config generation.'}
        </p>
      </div>
    </aside>
  );
};
