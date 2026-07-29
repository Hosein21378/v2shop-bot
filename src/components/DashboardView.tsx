import React from 'react';
import { VPNNode, UserSubscription, Order, Language } from '../types';
import { 
  DollarSign, 
  Users, 
  Activity, 
  Server, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Zap, 
  ShieldCheck,
  Terminal,
  Cpu,
  HardDrive
} from 'lucide-react';

interface DashboardViewProps {
  nodes: VPNNode[];
  subscriptions: UserSubscription[];
  orders: Order[];
  lang: Language;
  onNavigateToTab: (tab: any) => void;
  onApproveOrder: (orderId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  nodes,
  subscriptions,
  orders,
  lang,
  onNavigateToTab,
  onApproveOrder
}) => {
  const isFa = lang === 'fa';

  // Calculate Metrics
  const totalRevenueToman = orders
    .filter(o => o.status === 'approved')
    .reduce((acc, curr) => acc + curr.amountToman, 0);

  const activeSubCount = subscriptions.filter(s => s.status === 'active').length;
  
  const totalBandwidthGb = nodes.reduce((acc, curr) => acc + curr.usedBandwidthGb, 0);
  const onlineNodesCount = nodes.filter(n => n.status === 'online').length;
  const pendingOrders = orders.filter(o => o.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-5 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isFa ? 'سیستم آماده بهره‌برداری و اتصال به ربات' : 'System Ready for Telegram Bot Deployment'}</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {isFa ? 'به کنسول مدیریت فروشگاه و ربات V2Shop خوش آمدید' : 'Welcome to V2Shop Control Panel'}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {isFa 
                ? 'امکان ساخت خودکار کانفیگ‌های VLESS Reality و Trojan، اتصال به مرزبان و 3X-UI، تایید هوشمند فیش‌ها و نصب آسان روی سرور با کد تک خطی.'
                : 'Automated VLESS Reality & Trojan configs generation, Marzban/3X-UI panel hooks, and single-command VPS script installation.'}
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('vps-installer')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <Terminal className="w-4 h-4" />
            <span>{isFa ? 'دریافت اسکریپت نصب روی VPS' : 'Get VPS One-Line Installer'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">
              {isFa ? 'درآمد کل تایید شده' : 'Total Revenue'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-white font-mono tracking-wide">
            {totalRevenueToman.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">{isFa ? 'تومان' : 'Toman'}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% {isFa ? 'نسبت به هفته گذشته' : 'vs last week'}</span>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">
              {isFa ? 'اشتراک‌های فعال' : 'Active Subscriptions'}
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {activeSubCount.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">{isFa ? 'کاربر' : 'users'}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {subscriptions.length} {isFa ? 'کاربر کل ثبت شده' : 'total registered'}
          </div>
        </div>

        {/* Bandwidth Usage */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">
              {isFa ? 'مصرف کل ترافیک' : 'Total Bandwidth'}
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {(totalBandwidthGb / 1024).toFixed(2)} <span className="text-xs font-normal text-slate-400">TB</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isFa ? 'مجموع ۴ سرور اختصاصی' : 'Across 4 active nodes'}
          </div>
        </div>

        {/* Online Server Nodes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">
              {isFa ? 'وضعیت نودها و سرورها' : 'Nodes Health'}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {onlineNodesCount} / {nodes.length}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isFa ? '۹۹.۸٪ آپ‌تایم ماهانه' : '99.8% monthly uptime'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Server Nodes Status + Pending Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Server Nodes Live Monitor (2 columns) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>{isFa ? 'وضعیت زنده سرورها و پنل‌های VPN' : 'Live VPN Nodes & Panels'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isFa ? 'پایش میزان CPU، RAM، پینگ و کاربران آنلاین هر سرور' : 'Real-time CPU, RAM, Latency & Active connection metrics'}
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('panels')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>{isFa ? 'مدیریت کامل پنل‌ها' : 'Manage Panels'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nodes.map((node) => (
              <div 
                key={node.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{node.flag}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{node.name}</h4>
                      <p className="text-[11px] font-mono text-slate-400">{node.host}:{node.port}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    node.status === 'online' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {node.status === 'online' ? (isFa ? 'آنلاین' : 'Online') : (isFa ? 'اختلال جزئی' : 'Degraded')}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">{isFa ? 'پینگ' : 'Ping'}</span>
                    <span className="font-mono font-bold text-slate-200">{node.latencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{isFa ? 'کاربر فعال' : 'Users'}</span>
                    <span className="font-mono font-bold text-cyan-400">{node.activeUsers}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{isFa ? 'مصرف ترافیک' : 'Used'}</span>
                    <span className="font-mono font-bold text-indigo-300">{(node.usedBandwidthGb / 1000).toFixed(1)} TB</span>
                  </div>
                </div>

                {/* Progress bars for CPU & RAM */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-slate-500" /> CPU
                    </span>
                    <span className="font-mono text-slate-300">{node.cpuUsage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${node.cpuUsage > 80 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                      style={{ width: `${node.cpuUsage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-slate-500" /> RAM
                    </span>
                    <span className="font-mono text-slate-300">{node.ramUsage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${node.ramUsage > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                      style={{ width: `${node.ramUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approval Requests Widget (1 column) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isFa ? 'فیش‌های واریزی منتظر تایید' : 'Pending Receipts'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {pendingOrders.length} {isFa ? 'سفارش در صف تایید' : 'in queue'}
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('orders')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              {isFa ? 'مشاهده همه' : 'View all'}
            </button>
          </div>

          <div className="space-y-3">
            {pendingOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                {isFa ? 'هیچ فیش واریزی جدیدی در صف نیست 👍' : 'No pending receipts in queue'}
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div key={order.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">@{order.username}</span>
                    <span className="font-mono text-[10px] text-amber-400">{order.orderCode}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    {order.packageName}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {order.amountToman.toLocaleString('fa-IR')} {isFa ? 'تومان' : 'Toman'}
                    </span>
                    <button
                      onClick={() => onApproveOrder(order.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
                    >
                      {isFa ? 'تایید و صدور خودکار' : 'Approve & Issue'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
