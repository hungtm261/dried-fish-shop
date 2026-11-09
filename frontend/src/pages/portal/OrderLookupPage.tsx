import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, PackageSearch } from 'lucide-react';
import { Order } from '../../types';
import { formatDateTime, formatVND, ORDER_STATUS_LABELS } from '../../utils/format';

export const OrderLookupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const performLookup = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/lookup?query=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performLookup(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <PackageSearch className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Tra Cứu Trạng Thái Đơn Hàng
            </h1>
            <p className="text-xs text-slate-500">
              Nhập Số điện thoại đặt hàng (VD: 0908123456) hoặc Mã đơn (VD: CK202601)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập số điện thoại hoặc mã đơn #CK..."
            className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl text-sm"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Đang tìm...' : 'Tra Cứu Ngay'}</span>
          </button>
        </form>
      </div>

      {searched && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-sm text-slate-600">
              Không tìm thấy đơn hàng nào khớp với thông tin <strong>"{query}"</strong>.
            </div>
          ) : (
            orders.map((order) => {
              const st = ORDER_STATUS_LABELS[order.status] || ORDER_STATUS_LABELS.PENDING;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <span className="font-black text-base text-slate-900">
                        Đơn hàng #{order.orderCode}
                      </span>
                      <span className="text-xs text-slate-400 ml-3">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${st.badgeClass}`}
                    >
                      {st.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div>
                      Người nhận: <strong className="text-slate-900">{order.customerName}</strong> (
                      {order.customerPhone})
                    </div>
                    <div>
                      Thanh toán:{' '}
                      <strong className="text-slate-900">{order.paymentMethod}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      Địa chỉ giao: <strong className="text-slate-900">{order.shippingAddress}</strong>
                    </div>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span>
                          <strong>{item.productNameSnapshot}</strong> ({item.weightLabelSnapshot}) ×{' '}
                          {item.quantity}
                        </span>
                        <span className="font-bold">
                          {formatVND(item.unitPriceSnapshot * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-black text-rose-600 pt-2 border-t border-stone-200">
                      <span>Tổng thanh toán:</span>
                      <span>{formatVND(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

