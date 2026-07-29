import React, { useState } from 'react';
import { PackagePlan, DiscountCode, Language } from '../types';
import { 
  ShoppingBag, 
  Plus, 
  Tag, 
  Trash2, 
  Check, 
  Star, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  HardDrive, 
  ShieldCheck,
  Percent
} from 'lucide-react';

interface ShopPlansViewProps {
  plans: PackagePlan[];
  discounts: DiscountCode[];
  onAddPlan: (plan: PackagePlan) => void;
  onDeletePlan: (id: string) => void;
  onAddDiscount: (discount: DiscountCode) => void;
  onDeleteDiscount: (id: string) => void;
  lang: Language;
}

export const ShopPlansView: React.FC<ShopPlansViewProps> = ({
  plans,
  discounts,
  onAddPlan,
  onDeletePlan,
  onAddDiscount,
  onDeleteDiscount,
  lang
}) => {
  const isFa = lang === 'fa';

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  // New Plan State
  const [titleFa, setTitleFa] = useState('');
  const [trafficGb, setTrafficGb] = useState(30);
  const [durationDays, setDurationDays] = useState(30);
  const [priceToman, setPriceToman] = useState(120000);
  const [priceUsdt, setPriceUsdt] = useState(2.0);
  const [popular, setPopular] = useState(false);

  // New Discount State
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [maxUses, setMaxUses] = useState(50);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFa) return;

    const newPlan: PackagePlan = {
      id: `plan-${Date.now()}`,
      titleFa,
      titleEn: `${trafficGb}GB - ${durationDays} Days`,
      trafficGb: Number(trafficGb),
      durationDays: Number(durationDays),
      priceToman: Number(priceToman),
      priceUsdt: Number(priceUsdt),
      popular,
      active: true,
      protocols: ['VLESS+REALITY', 'VMess', 'Trojan'],
      maxDevices: 2,
      descriptionFa: 'سرور اختصاصی بدون قطعی'
    };

    onAddPlan(newPlan);
    setShowPlanModal(false);
    setTitleFa('');
  };

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newDiscount: DiscountCode = {
      id: `disc-${Date.now()}`,
      code: code.toUpperCase(),
      discountPercent: Number(discountPercent),
      fixedDiscountToman: 0,
      maxUses: Number(maxUses),
      usedCount: 0,
      expireDate: '2026-12-31',
      active: true
    };

    onAddDiscount(newDiscount);
    setShowDiscountModal(false);
    setCode('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <span>{isFa ? 'فروشگاه، تعرفه‌ها و کدهای تخفیف' : 'Shop Packages & Discounts'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFa 
              ? 'ایجاد پلن‌های اشتراک حجمی و زمانی، تعیین قیمت تومان و USDT، کدهای تخفیف' 
              : 'Configure subscription packages, volume GB, duration days, and promo codes'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDiscountModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <Tag className="w-4 h-4 text-amber-400" />
            <span>{isFa ? 'ایجاد کد تخفیف' : 'New Discount Code'}</span>
          </button>

          <button
            onClick={() => setShowPlanModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isFa ? 'تعریف پلن جدید' : 'Create Package Plan'}</span>
          </button>
        </div>
      </div>

      {/* Plans List Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 px-1">
          {isFa ? 'لیست پلن‌های فعال ربات' : 'Active Bot Store Plans'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-4 relative overflow-hidden transition-all ${
                plan.popular 
                  ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -left-12 top-4 -rotate-45 bg-indigo-600 text-white text-[10px] font-bold py-1 px-12 uppercase tracking-wider shadow-md">
                  {isFa ? 'محبوب‌ترین' : 'Popular'}
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{isFa ? plan.titleFa : plan.titleEn}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{plan.descriptionFa}</p>
                </div>

                <button
                  onClick={() => onDeletePlan(plan.id)}
                  className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">{isFa ? 'حجم کل' : 'Traffic'}</span>
                  <span className="font-bold text-cyan-400">{plan.trafficGb} GB</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{isFa ? 'اعتبار' : 'Duration'}</span>
                  <span className="font-bold text-indigo-300">{plan.durationDays} {isFa ? 'روز' : 'Days'}</span>
                </div>
              </div>

              {/* Price Tag */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-lg font-extrabold text-white font-mono">
                    {plan.priceToman.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-xs text-slate-400 mr-1">{isFa ? 'تومان' : 'Toman'}</span>
                </div>

                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  ${plan.priceUsdt} USDT
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discounts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-400" />
          <span>{isFa ? 'کدهای تخفیف فعال در ربات' : 'Active Promotional Discount Codes'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="p-3">{isFa ? 'کد تخفیف' : 'Code'}</th>
                <th className="p-3">{isFa ? 'میزان تخفیف' : 'Discount'}</th>
                <th className="p-3">{isFa ? 'تعداد استفاده' : 'Used / Max'}</th>
                <th className="p-3">{isFa ? 'تاریخ اعتبار' : 'Expiry Date'}</th>
                <th className="p-3">{isFa ? 'عملیات' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {discounts.map((disc) => (
                <tr key={disc.id} className="hover:bg-slate-950/40">
                  <td className="p-3 font-mono font-bold text-amber-400">{disc.code}</td>
                  <td className="p-3 text-slate-200">{disc.discountPercent}%</td>
                  <td className="p-3 font-mono text-slate-300">{disc.usedCount} / {disc.maxUses}</td>
                  <td className="p-3 font-mono text-slate-400">{disc.expireDate}</td>
                  <td className="p-3">
                    <button
                      onClick={() => onDeleteDiscount(disc.id)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      {isFa ? 'حذف' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{isFa ? 'تعریف پلن فروشگاهی جدید' : 'Create Package Plan'}</h3>
              <button onClick={() => setShowPlanModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">{isFa ? 'عنوان پلن (فارسی)' : 'Title (FA)'}</label>
                <input
                  type="text"
                  required
                  value={titleFa}
                  onChange={e => setTitleFa(e.target.value)}
                  placeholder="پلن یک‌ماهه ویژه ۵۰ گیگ"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'حجم به گیگابایت (GB)' : 'Traffic GB'}</label>
                  <input
                    type="number"
                    required
                    value={trafficGb}
                    onChange={e => setTrafficGb(parseInt(e.target.value) || 10)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'مدت زمان به روز' : 'Duration Days'}</label>
                  <input
                    type="number"
                    required
                    value={durationDays}
                    onChange={e => setDurationDays(parseInt(e.target.value) || 30)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'قیمت (تومان)' : 'Price Toman'}</label>
                  <input
                    type="number"
                    required
                    value={priceToman}
                    onChange={e => setPriceToman(parseInt(e.target.value) || 100000)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'قیمت (USDT)' : 'Price USDT'}</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={priceUsdt}
                    onChange={e => setPriceUsdt(parseFloat(e.target.value) || 1.5)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pop"
                  checked={popular}
                  onChange={e => setPopular(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600"
                />
                <label htmlFor="pop" className="text-slate-300">{isFa ? 'علامت‌گذاری به عنوان پلن محبوب' : 'Mark as Popular'}</label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  {isFa ? 'ایجاد پلن' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{isFa ? 'ایجاد کد تخفیف جدید' : 'Create Promo Code'}</h3>
              <button onClick={() => setShowDiscountModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateDiscount} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">{isFa ? 'کد تخفیف (لاتین)' : 'Discount Code'}</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="OFF30"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'درصد تخفیف (%)' : 'Percentage'}</label>
                  <input
                    type="number"
                    required
                    value={discountPercent}
                    onChange={e => setDiscountPercent(parseInt(e.target.value) || 10)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'حداکثر تعداد استفاده' : 'Max Uses'}</label>
                  <input
                    type="number"
                    required
                    value={maxUses}
                    onChange={e => setMaxUses(parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiscountModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  {isFa ? 'ذخیره کد تخفیف' : 'Save Promo Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
