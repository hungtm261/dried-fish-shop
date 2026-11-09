import React, { useEffect, useState } from 'react';
import { Phone, MapPin, FileText } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatDateTime, formatVND, ORDER_STATUS_LABELS } from '../../utils/format';

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPING',
  'COMPLETED',
  'CANCELLED',
];

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const loadOrders = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${status}`);
      const data = await res.json();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(filterStatus);
  }, [filterStatus]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Quản Lý Đơn Mua Bán Cá Khô
          </h2>
          <p className="text-xs text-slate-500">
            Xem chi tiết từng túi cá khách đặt và cập nhật trạng thái xử lý đơn hàng
          </p>
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            Tất Cả ({orders.length})
          </button>
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {ORDER_STATUS_LABELS[st].label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-500">
          Không có đơn hàng nào ở trạng thái này.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const stInfo =
              ORDER_STATUS_LABELS[order.status] || ORDER_STATUS_LABELS.PENDING;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-base text-slate-900">
                      #{order.orderCode}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${stInfo.badgeClass}`}
                    >
                      {stInfo.label}
                    </span>
                    <span className="text-xs text-slate-400">
                      Đặt lúc: {formatDateTime(order.createdAt)}
                    </span>
                  </div>

                  {/* Đổi trạng thái đơn */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">
                      Chuyển trạng thái:
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="text-xs font-bold rounded-xl border border-slate-300 px-3 py-2 bg-slate-50 focus:outline-none focus:border-amber-500"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {ORDER_STATUS_LABELS[opt].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Thông tin khách & Danh sách món */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-5 space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl">
                    <div className="font-bold text-slate-900 text-sm">
                      Khách hàng: {order.customerName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="font-bold text-amber-700 hover:underline"
                      >
                        {order.customerPhone}
                      </a>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold">{order.paymentMethod}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{order.shippingAddress}</span>
                    </div>
                    {order.note && (
                      <div className="flex items-start gap-2 text-amber-900 bg-amber-100/70 p-2 rounded-lg">
                        <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>Ghi chú: {order.note}</span>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="divide-y divide-slate-100">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-2 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900">
                              {item.productNameSnapshot}
                            </span>
                            <span className="ml-2 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                              {item.weightLabelSnapshot}
                            </span>
                            <span className="ml-2 text-slate-500">
                              × {item.quantity}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900">
                            {formatVND(item.unitPriceSnapshot * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 text-sm">
                      <span className="text-xs text-slate-500">
                        Phí ship:{' '}
                        {order.shippingFee === 0
                          ? 'Miễn phí'
                          : formatVND(order.shippingFee)}
                      </span>
                      <div className="font-black text-rose-600 text-base">
                        Tổng thu: {formatVND(order.totalAmount)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

