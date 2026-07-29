import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  Language, 
  VPNNode, 
  PackagePlan, 
  UserSubscription, 
  Order, 
  DiscountCode, 
  BotSettings 
} from './types';
import { 
  initialNodes, 
  initialPlans, 
  initialSubscriptions, 
  initialOrders, 
  initialDiscounts, 
  initialBotSettings 
} from './data/mockData';
import { generateSubUrl, generateVlessLink } from './utils/configGenerator';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { BotManagerView } from './components/BotManagerView';
import { PanelManagerView } from './components/PanelManagerView';
import { ShopPlansView } from './components/ShopPlansView';
import { UsersView } from './components/UsersView';
import { OrdersView } from './components/OrdersView';
import { BotSimulatorView } from './components/BotSimulatorView';
import { InstallerDeployView } from './components/InstallerDeployView';

export default function App() {
  // App State initialized with localStorage or fallback to initial data
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('v2shop_lang') as Language) || 'fa';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [nodes, setNodes] = useState<VPNNode[]>(() => {
    const saved = localStorage.getItem('v2shop_nodes');
    return saved ? JSON.parse(saved) : initialNodes;
  });

  const [plans, setPlans] = useState<PackagePlan[]>(() => {
    const saved = localStorage.getItem('v2shop_plans');
    return saved ? JSON.parse(saved) : initialPlans;
  });

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>(() => {
    const saved = localStorage.getItem('v2shop_subs');
    return saved ? JSON.parse(saved) : initialSubscriptions;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('v2shop_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [discounts, setDiscounts] = useState<DiscountCode[]>(() => {
    const saved = localStorage.getItem('v2shop_discounts');
    return saved ? JSON.parse(saved) : initialDiscounts;
  });

  const [botSettings, setBotSettings] = useState<BotSettings>(() => {
    const saved = localStorage.getItem('v2shop_bot_settings');
    return saved ? JSON.parse(saved) : initialBotSettings;
  });

  const [toast, setToast] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('v2shop_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('v2shop_nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('v2shop_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('v2shop_subs', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('v2shop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('v2shop_discounts', JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    localStorage.setItem('v2shop_bot_settings', JSON.stringify(botSettings));
  }, [botSettings]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Handlers
  const handleAddNode = (newNode: VPNNode) => {
    setNodes(prev => [newNode, ...prev]);
    showToast(lang === 'fa' ? 'سرور جدید با موفقیت اضافه شد' : 'New node added successfully');
  };

  const handleDeleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    showToast(lang === 'fa' ? 'سرور حذف شد' : 'Node removed');
  };

  const handleAddPlan = (newPlan: PackagePlan) => {
    setPlans(prev => [...prev, newPlan]);
    showToast(lang === 'fa' ? 'پلن جدید به فروشگاه اضافه شد' : 'New package plan created');
  };

  const handleDeletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    showToast(lang === 'fa' ? 'پلن حذف شد' : 'Plan deleted');
  };

  const handleAddDiscount = (newDiscount: DiscountCode) => {
    setDiscounts(prev => [...prev, newDiscount]);
    showToast(lang === 'fa' ? 'کد تخفیف جدید ایجاد شد' : 'Discount code created');
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
    showToast(lang === 'fa' ? 'کد تخفیف حذف شد' : 'Discount code deleted');
  };

  const handleApproveOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Mark order approved
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'approved', refId: `SYS-${Math.floor(Math.random() * 900000) + 100000}` } : o));

    // Check if user subscription exists or create new
    const existingSub = subscriptions.find(s => s.telegramId === order.telegramId);
    if (existingSub) {
      setSubscriptions(prev => prev.map(s => s.telegramId === order.telegramId ? {
        ...s,
        totalTrafficGb: s.totalTrafficGb + 60,
        status: 'active'
      } : s));
    } else {
      const newSub: UserSubscription = {
        id: `sub-${Date.now()}`,
        telegramId: order.telegramId,
        username: order.username,
        fullName: order.username,
        packageNameFa: order.packageName,
        packageNameEn: order.packageName,
        totalTrafficGb: 60,
        usedTrafficGb: 0,
        startDate: new Date().toISOString().split('T')[0],
        expireDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'active',
        subUrl: generateSubUrl(order.telegramId),
        configLinks: [generateVlessLink()],
        balanceToman: 0,
        nodeId: nodes[0]?.id || 'node-1'
      };
      setSubscriptions(prev => [newSub, ...prev]);
    }

    showToast(lang === 'fa' ? `سفارش ${order.orderCode} تایید و اشتراک صادر گردید` : `Order ${order.orderCode} approved & subscription issued`);
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o));
    showToast(lang === 'fa' ? 'سفارش رد شد' : 'Order rejected');
  };

  const handleUpdateSubscription = (updated: UserSubscription) => {
    setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
    showToast(lang === 'fa' ? 'اشتراک کاربر بروزرسانی شد' : 'User subscription updated');
  };

  const handleSaveBotSettings = (updated: BotSettings) => {
    setBotSettings(updated);
    showToast(lang === 'fa' ? 'تنظیمات ربات ذخیره شد' : 'Bot settings saved');
  };

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div 
      dir={lang === 'fa' ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col"
    >
      {/* Navbar Header */}
      <Navbar
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        botStatus="online"
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          pendingOrdersCount={pendingOrdersCount}
        />

        {/* Content Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              nodes={nodes}
              subscriptions={subscriptions}
              orders={orders}
              lang={lang}
              onNavigateToTab={setActiveTab}
              onApproveOrder={handleApproveOrder}
            />
          )}

          {activeTab === 'bot-manager' && (
            <BotManagerView
              settings={botSettings}
              onSaveSettings={handleSaveBotSettings}
              lang={lang}
            />
          )}

          {activeTab === 'panels' && (
            <PanelManagerView
              nodes={nodes}
              onAddNode={handleAddNode}
              onDeleteNode={handleDeleteNode}
              lang={lang}
            />
          )}

          {activeTab === 'plans' && (
            <ShopPlansView
              plans={plans}
              discounts={discounts}
              onAddPlan={handleAddPlan}
              onDeletePlan={handleDeletePlan}
              onAddDiscount={handleAddDiscount}
              onDeleteDiscount={handleDeleteDiscount}
              lang={lang}
            />
          )}

          {activeTab === 'users' && (
            <UsersView
              subscriptions={subscriptions}
              onUpdateSubscription={handleUpdateSubscription}
              lang={lang}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              orders={orders}
              onApproveOrder={handleApproveOrder}
              onRejectOrder={handleRejectOrder}
              lang={lang}
            />
          )}

          {activeTab === 'bot-simulator' && (
            <BotSimulatorView
              settings={botSettings}
              plans={plans}
              lang={lang}
            />
          )}

          {activeTab === 'vps-installer' && (
            <InstallerDeployView
              settings={botSettings}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
