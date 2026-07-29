import React, { useState } from 'react';
import { BotSettings, Language } from '../types';
import { 
  Bot, 
  Key, 
  ShieldCheck, 
  CreditCard, 
  Send, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  QrCode,
  DollarSign,
  UserCheck,
  Bell
} from 'lucide-react';

interface BotManagerViewProps {
  settings: BotSettings;
  onSaveSettings: (updated: BotSettings) => void;
  lang: Language;
}

export const BotManagerView: React.FC<BotManagerViewProps> = ({
  settings,
  onSaveSettings,
  lang
}) => {
  const isFa = lang === 'fa';
  const [formData, setFormData] = useState<BotSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Save Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span>{isFa ? 'تنظیمات پیکربندی ربات تلگرام' : 'Telegram Bot Core Setup'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFa 
              ? 'توکن BotFather، کانال قفل عضویت اجباری، پیام خوش‌آمدگویی و درگاه‌های پرداخت' 
              : 'BotFather token, mandatory channel join lock, welcome message & payment gateways'}
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isFa ? 'ذخیره تغییرات ربات' : 'Save Bot Config'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{isFa ? 'تنظیمات ربات تلگرام با موفقیت بروزرسانی و ذخیره شد.' : 'Bot settings saved successfully.'}</span>
        </div>
      )}

      {/* Main Form Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Telegram Bot Credentials & Admin Security */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              {isFa ? 'توکن و دسترسی‌های ربات' : 'Token & Admin Access'}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isFa ? 'توکن ربات تلگرام (Bot Token from BotFather)' : 'Telegram Bot Token'}
              </label>
              <input
                type="text"
                value={formData.botToken}
                onChange={e => setFormData({ ...formData, botToken: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="7192834012:AAH9f2Xk8..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {isFa ? 'یوزرنیم ربات (بدون @)' : 'Bot Username'}
                </label>
                <input
                  type="text"
                  value={formData.botUsername}
                  onChange={e => setFormData({ ...formData, botUsername: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="V2ShopVPNBot"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {isFa ? 'آیدی پشتیبانی تلگرام' : 'Support Username'}
                </label>
                <input
                  type="text"
                  value={formData.supportUsername}
                  onChange={e => setFormData({ ...formData, supportUsername: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="V2Shop_Admin_Support"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isFa ? 'آیدی عددی ادمین‌ها (با کاما جدا کنید)' : 'Admin Telegram Numeric IDs'}
              </label>
              <input
                type="text"
                value={formData.adminIds.join(', ')}
                onChange={e => setFormData({ ...formData, adminIds: e.target.value.split(',').map(s => s.trim()) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="98765432, 12345678"
              />
            </div>

            {/* Mandatory Channel Lock */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-200 font-medium">
                  {isFa ? 'قفل جوین اجباری در کانال تلگرام' : 'Mandatory Channel Join Lock'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requireChannelJoin}
                    onChange={e => setFormData({ ...formData, requireChannelJoin: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {formData.requireChannelJoin && (
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">
                    {isFa ? 'آیدی کانال تلگرام (مثال: V2ShopNet_Channel@)' : 'Channel Username'}
                  </label>
                  <input
                    type="text"
                    value={formData.mandatoryChannel}
                    onChange={e => setFormData({ ...formData, mandatoryChannel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Payment Gateways Settings (Card to card, Zarinpal, USDT) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              {isFa ? 'درگاه‌های پرداخت و واریز' : 'Payment Gateways'}
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Card to Card */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>💳 {isFa ? 'پرداخت کارت به کارت (آپلود فیش)' : 'Card to Card Transfer'}</span>
                <input
                  type="checkbox"
                  checked={formData.paymentGateways.cardToCard.enabled}
                  onChange={e => setFormData({
                    ...formData,
                    paymentGateways: {
                      ...formData.paymentGateways,
                      cardToCard: { ...formData.paymentGateways.cardToCard, enabled: e.target.checked }
                    }
                  })}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                />
              </div>

              {formData.paymentGateways.cardToCard.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isFa ? 'شماره کارت ۱۶ رقمی' : 'Card Number'}</label>
                    <input
                      type="text"
                      value={formData.paymentGateways.cardToCard.cardNumber}
                      onChange={e => setFormData({
                        ...formData,
                        paymentGateways: {
                          ...formData.paymentGateways,
                          cardToCard: { ...formData.paymentGateways.cardToCard, cardNumber: e.target.value }
                        }
                      })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isFa ? 'نام صاحب حساب' : 'Card Holder Name'}</label>
                    <input
                      type="text"
                      value={formData.paymentGateways.cardToCard.cardHolder}
                      onChange={e => setFormData({
                        ...formData,
                        paymentGateways: {
                          ...formData.paymentGateways,
                          cardToCard: { ...formData.paymentGateways.cardToCard, cardHolder: e.target.value }
                        }
                      })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ZarinPal Gateway */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>🟡 {isFa ? 'درگاه ریالی زرین‌پال' : 'Zarinpal Gateway'}</span>
                <input
                  type="checkbox"
                  checked={formData.paymentGateways.zarinpal.enabled}
                  onChange={e => setFormData({
                    ...formData,
                    paymentGateways: {
                      ...formData.paymentGateways,
                      zarinpal: { ...formData.paymentGateways.zarinpal, enabled: e.target.checked }
                    }
                  })}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                />
              </div>

              {formData.paymentGateways.zarinpal.enabled && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">{isFa ? 'مرچنت آیدی زرین‌پال (Merchant ID)' : 'Merchant ID'}</label>
                  <input
                    type="text"
                    value={formData.paymentGateways.zarinpal.merchantId}
                    onChange={e => setFormData({
                      ...formData,
                      paymentGateways: {
                        ...formData.paymentGateways,
                        zarinpal: { ...formData.paymentGateways.zarinpal, merchantId: e.target.value }
                      }
                    })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Crypto USDT Gateway */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>🪙 {isFa ? 'پرداخت کریپتو USDT (Tron TRC20)' : 'Crypto USDT (TRC20)'}</span>
                <input
                  type="checkbox"
                  checked={formData.paymentGateways.crypto.enabled}
                  onChange={e => setFormData({
                    ...formData,
                    paymentGateways: {
                      ...formData.paymentGateways,
                      crypto: { ...formData.paymentGateways.crypto, enabled: e.target.checked }
                    }
                  })}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                />
              </div>

              {formData.paymentGateways.crypto.enabled && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">{isFa ? 'آدرس کیف پول تتر (TRC20 Wallet Address)' : 'TRC20 Wallet'}</label>
                  <input
                    type="text"
                    value={formData.paymentGateways.crypto.usdtAddress}
                    onChange={e => setFormData({
                      ...formData,
                      paymentGateways: {
                        ...formData.paymentGateways,
                        crypto: { ...formData.paymentGateways.crypto, usdtAddress: e.target.value }
                      }
                    })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-xs text-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Welcome Message & Trial Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
          <Send className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">
            {isFa ? 'متن خوش‌آمدگویی و تست رایگان' : 'Welcome Message & Free Trial Settings'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isFa ? 'متن پیام /start به زبان فارسی' : 'Persian Welcome Message'}
            </label>
            <textarea
              rows={5}
              value={formData.welcomeMessageFa}
              onChange={e => setFormData({ ...formData, welcomeMessageFa: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="space-y-3">
            {/* Free Trial Toggle */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">
                  🎁 {isFa ? 'فعال‌سازی تست رایگان برای کاربران جدید' : 'Enable Free Trial'}
                </span>
                <input
                  type="checkbox"
                  checked={formData.trialEnabled}
                  onChange={e => setFormData({ ...formData, trialEnabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                />
              </div>

              {formData.trialEnabled && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isFa ? 'حجم تست (گیگ)' : 'Trial Traffic (GB)'}</label>
                    <input
                      type="number"
                      value={formData.trialTrafficGb}
                      onChange={e => setFormData({ ...formData, trialTrafficGb: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isFa ? 'مدت زمان (روز)' : 'Trial Days'}</label>
                    <input
                      type="number"
                      value={formData.trialDays}
                      onChange={e => setFormData({ ...formData, trialDays: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-indigo-300 text-[11px] leading-relaxed">
              💡 {isFa 
                ? 'با ذخیره این بخش، تمام تنظیمات روی کد تولیدی ربات تلگرام و فایل کانفیگ server.env بلافاصله اعمال می‌شود.' 
                : 'Saving updates both runtime config and exportable server environment files.'}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
