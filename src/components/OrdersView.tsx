import React, { useState } from 'react';
import { Order, Language } from '../types';
import { 
  Receipt, 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon, 
  Clock, 
  DollarSign, 
  User, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onApproveOrder: (id: string) => void;
  onRejectOrder: (id: string) => void;
  lang: Language;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onApproveOrder,
  onRejectOrder,
  lang
}) => {
  const isFa = lang === 'fa';
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <span>{isFa ? 'مدیریت سفارشات و تایید فیش‌های واریزی' : 'Orders & Payment Receipts Approval'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFa 
              ? 'بررسی تصاویر فیش‌های واریز کارت به کارت و صدور خودکار کانفیگ با یک کلیک' 
              : 'Verify card-to-card proof images and auto-issue subscriptions with 1 click'}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="p-3.5">{isFa ? 'کد سفارش' : 'Order Code'}</th>
                <th className="p-3.5">{isFa ? 'کاربر' : 'User'}</th>
                <th className="p-3.5">{isFa ? 'پلن درخواستی' : 'Requested Package'}</th>
                <th className="p-3.5">{isFa ? 'مبلغ و روش پرداخت' : 'Amount & Method'}</th>
                <th className="p-3.5 text-center">{isFa ? 'فیش واریزی' : 'Receipt Image'}</th>
                <th className="p-3.5">{isFa ? 'وضعیت' : 'Status'}</th>
                <th className="p-3.5 text-center">{isFa ? 'عملیات تایید' : 'Action'}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-amber-400">
                    {order.orderCode}
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-white">@{order.username}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{order.createdAt}</div>
                  </td>

                  <td className="p-3.5 font-medium text-slate-200">
                    {order.packageName}
                  </td>

                  <td className="p-3.5">
                    <div className="font-mono font-bold text-emerald-400">
                      {order.amountToman.toLocaleString('fa-IR')} {isFa ? 'تومان' : 'Toman'}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {order.paymentMethod === 'card_to_card' 
                        ? (isFa ? '💳 کارت به کارت' : 'Card to Card') 
                        : order.paymentMethod === 'zarinpal'
                        ? (isFa ? '🟡 زرین‌پال' : 'Zarinpal')
                        : (isFa ? '🪙 کریپتو' : 'Crypto USDT')}
                    </div>
                  </td>

                  <td className="p-3.5 text-center">
                    {order.receiptImage ? (
                      <button
                        onClick={() => setSelectedReceipt(order.receiptImage!)}
                        className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] inline-flex items-center gap-1 font-medium"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{isFa ? 'مشاهده تصویر' : 'View Image'}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500">{isFa ? 'ندارد' : 'N/A'}</span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      order.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : order.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {order.status === 'approved' ? (isFa ? 'تایید و صادر شد' : 'Approved') : order.status === 'pending' ? (isFa ? 'در انتظار تایید' : 'Pending') : (isFa ? 'رد شده' : 'Rejected')}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    {order.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onApproveOrder(order.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isFa ? 'تایید و صدور' : 'Approve'}</span>
                        </button>

                        <button
                          onClick={() => onRejectOrder(order.id)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-medium"
                        >
                          {isFa ? 'رد' : 'Reject'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-mono">
                        {order.refId || '—'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Receipt Image Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">{isFa ? 'تصویر فیش واریزی کارت به کارت' : 'Receipt Proof Image'}</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 max-h-96 bg-black flex items-center justify-center">
              <img src={selectedReceipt} alt="Receipt" className="max-h-80 object-contain" />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedReceipt(null)}
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
