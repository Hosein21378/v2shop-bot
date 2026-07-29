import React, { useState } from 'react';
import { BotSettings, PackagePlan, TelegramSimMessage, Language } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Bot, 
  Send, 
  User, 
  RefreshCw, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Paperclip, 
  Copy,
  ChevronRight,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface BotSimulatorViewProps {
  settings: BotSettings;
  plans: PackagePlan[];
  lang: Language;
}

export const BotSimulatorView: React.FC<BotSimulatorViewProps> = ({
  settings,
  plans,
  lang
}) => {
  const isFa = lang === 'fa';

  const [input, setInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const initialMessages: TelegramSimMessage[] = [
    {
      id: 'm-1',
      sender: 'bot',
      text: settings.welcomeMessageFa,
      timestamp: '10:58',
      inlineKeyboard: [
        [
          { text: '🛍️ خرید اشتراک جدید', callbackData: 'buy_plans' },
          { text: '👤 حساب کاربری من', callbackData: 'my_account' }
        ],
        [
          { text: '🔗 دریافت لینک ساب‌اسکریپشن', callbackData: 'get_sub' },
          { text: '🌐 وضعیت سرورها', callbackData: 'server_list' }
        ],
        [
          { text: '🎁 کد تخفیف / هدیه', callbackData: 'discount_code' },
          { text: '💬 پشتیبانی تلگرام', callbackData: 'support' }
        ]
      ]
    }
  ];

  const [messages, setMessages] = useState<TelegramSimMessage[]>(initialMessages);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: TelegramSimMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      processBotReply(text);
    }, 600);
  };

  const handleCallbackClick = (callbackData: string) => {
    let clickedText = 'کلیک بر روی دکمه';
    if (callbackData === 'buy_plans') clickedText = '🛍️ خرید اشتراک جدید';
    if (callbackData === 'my_account') clickedText = '👤 حساب کاربری من';
    if (callbackData === 'get_sub') clickedText = '🔗 دریافت لینک ساب‌اسکریپشن';
    if (callbackData === 'server_list') clickedText = '🌐 وضعیت سرورها';
    if (callbackData === 'discount_code') clickedText = '🎁 کد تخفیف / هدیه';
    if (callbackData === 'support') clickedText = '💬 پشتیبانی تلگرام';

    handleSendMessage(clickedText);
  };

  const processBotReply = (text: string) => {
    let replyText = 'دستور ناشناخته است. جهت مشاهده راهنما عبارت /start را ارسال کنید.';
    let keyboard: TelegramSimMessage['inlineKeyboard'] = undefined;

    if (text === '/start' || text.includes('منوی اصلی') || text.includes('خوش آمدید')) {
      replyText = settings.welcomeMessageFa;
      keyboard = [
        [
          { text: '🛍️ خرید اشتراک جدید', callbackData: 'buy_plans' },
          { text: '👤 حساب کاربری من', callbackData: 'my_account' }
        ],
        [
          { text: '🔗 دریافت لینک ساب‌اسکریپشن', callbackData: 'get_sub' },
          { text: '🌐 وضعیت سرورها', callbackData: 'server_list' }
        ]
      ];
    } else if (text.includes('خرید اشتراک') || text === 'buy_plans') {
      replyText = '📦 **لیست پلن‌های فعال فروشگاه:**\n\nلطفاً پلن مورد نظر خود را جهت دریافت اطلاعات کارت به کارت و پرداخت انتخاب نمایید:';
      keyboard = plans.map(p => ([
        { text: `خرید ${p.titleFa} - ${p.priceToman.toLocaleString('fa-IR')} تومان`, callbackData: `pay_${p.id}` }
      ]));
    } else if (text.includes('حساب کاربری') || text === 'my_account') {
      replyText = '👤 **مشخصات حساب کاربری شما:**\n\n' +
        '▫️ آیدی عددی: `98765432`\n' +
        '▫️ یوزرنیم: @ali_rezaei\n' +
        '▫️ اشتراک فعال: پلن یک‌ماهه حرفه‌ای (۶۰ گیگ)\n' +
        '▫️ ترافیک مصرفی: ۲۴.۵ گیگ از ۶۰ گیگابایت\n' +
        '▫️ مهلت انقضا: ۲۰ روز باقی‌مانده (1405/05/20)\n' +
        '▫️ اعتبار کیف پول: ۴۵,۰۰۰ تومان';
      keyboard = [
        [{ text: '🔄 تتمدید اشتراک فعلی', callbackData: 'buy_plans' }],
        [{ text: '🔗 دریافت لینک ساب‌اسکریپشن', callbackData: 'get_sub' }]
      ];
    } else if (text.includes('ساب‌اسکریپشن') || text === 'get_sub') {
      replyText = '🔗 **لینک ساب‌اسکریپشن هوشمند شما:**\n\n' +
        '`https://sub.v2server-net.com/sub/v2shop-98765432-x9y8z7`\n\n' +
        '📌 می‌توانید این لینک را مستقیماً در نرم‌افزار V2rayNG / NekoBox کپی نمایید.\n\n' +
        '⚡ **کانفیگ VLESS Reality مجزا:**\n' +
        '`vless://8a91b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c@de1.v2server-net.com:8443?type=tcp&security=reality#V2Shop_DE_Reality`';
    } else if (text.includes('سرورها') || text === 'server_list') {
      replyText = '🌐 **وضعیت آنلاین سرورها و نودهای اختصاصی:**\n\n' +
        '🇩🇪 آلمان فرانکفورت (Marzban) - پینگ: 42ms ✅\n' +
        '🇳🇱 هلند آمستردام (3X-UI) - پینگ: 58ms ✅\n' +
        '🇫🇮 فنلاند هلسینکی (Hiddify) - پینگ: 65ms ✅\n\n' +
        'تمام سرورها دارای پروتکل VLESS Reality و آی‌پی تمیز بدون قطعی می‌باشند.';
    } else if (text.includes('فیش') || text.includes('پرداخت') || text.startsWith('خرید پلن')) {
      replyText = '💳 **اطلاعات حساب جهت کارت به کارت:**\n\n' +
        `شماره کارت: \`${settings.paymentGateways.cardToCard.cardNumber}\`\n` +
        `بنام: ${settings.paymentGateways.cardToCard.cardHolder}\n` +
        `بانک: ${settings.paymentGateways.cardToCard.bankName}\n\n` +
        '📸 پس از واریز، تصویر فیش را در همین چت ارسال کنید تا سیستم به صورت هوشمند اشتراک شما را صادر کند.';
    } else {
      replyText = `دستور "${text}" دریافت شد.\n\nجهت دریافت منوی اصلی کلمه /start را ارسال کنید.`;
    }

    const botMsg: TelegramSimMessage = {
      id: `m-${Date.now()}`,
      sender: 'bot',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inlineKeyboard: keyboard
    };

    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>{isFa ? 'شبیه‌ساز زنده ربات تلگرام (تست تعاملی)' : 'Live Interactive Telegram Bot Simulator'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFa 
              ? 'تست رفتار واقعی ربات، دکمه‌های شیشه‌ای (Inline Keyboards)، خرید اشتراک و دریافت کانفیگ' 
              : 'Test how your end customers interact with the bot in real time.'}
          </p>
        </div>

        <button
          onClick={() => setMessages(initialMessages)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isFa ? 'بازنشانی گفتگو' : 'Reset Chat'}</span>
        </button>
      </div>

      {/* Telegram Chat Frame Container */}
      <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
        {/* Telegram Chat Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">@{settings.botUsername}</h3>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                bot • online
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
            {isFa ? 'نسخه زنده' : 'Live Mock'}
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div 
                key={msg.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 shadow-md ${
                    isBot 
                      ? 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none' 
                      : 'bg-indigo-600 text-white rounded-tr-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">{msg.text}</p>

                  {/* Inline Keyboard Buttons if present */}
                  {msg.inlineKeyboard && (
                    <div className="pt-2 space-y-1.5">
                      {msg.inlineKeyboard.map((row, rIdx) => (
                        <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {row.map((btn, bIdx) => (
                            <button
                              key={bIdx}
                              onClick={() => handleCallbackClick(btn.callbackData)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-indigo-700/80 text-cyan-300 font-semibold text-[11px] border border-slate-700/60 transition-colors text-center truncate"
                            >
                              {btn.text}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[9px] text-slate-400 text-left dir-ltr font-mono pt-1">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={() => handleSendMessage('ارسال تصویر فیش پرداخت')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={isFa ? 'ارسال فیش واریزی نمادین' : 'Send receipt sample'}
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder={isFa ? 'پیام خود را تایپ کنید یا کلمه /start را ارسال نمایید...' : 'Type /start or your command...'}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={() => handleSendMessage()}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
