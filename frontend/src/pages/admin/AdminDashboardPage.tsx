import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { AdminStats } from '../../types';
import { formatDateTime, formatVND, ORDER_STATUS_LABELS } from '../../utils/format';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-32 rounded-2xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">
              Tổng Doanh Thu Thực Tế
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatVND(stats.totalRevenue)}
            </div>
            <span className="text-xs text-emerald-600 font-semibold">
              Tính trên {stats.totalOrders} đơn hàng
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">
              Đơn Mới Chờ Chốt
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {stats.pendingOrdersCount} đơn
            </div>
            <Link
              to="/admin/orders"
              className="text-xs text-amber-700 hover:underline font-semibold"
            >
              Xử lý đơn ngay →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">
              Mặt Hàng Cá Khô
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats.totalProducts} sản phẩm
            </div>
            <span className="text-xs text-slate-500">
              Thuộc {stats.totalCategories} danh mục
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">
              Cảnh Báo Sắp Hết Kho
            </span>
            <div className="text-2xl font-black text-rose-600 mt-1">
              {stats.lowStockVariants.length} phân loại
            </div>
            <span className="text-xs text-slate-500">Tồn kho &le; 10 túi</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Bảng đơn hàng mới nhất & Cảnh báo tồn kho */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">
                Đơn Đặt Hàng Mới Nhất
              </h2>
              <p className="text-xs text-slate-500">
                Các đơn khách vừa đặt từ trang Portal cần gọi xác nhận và đóng gói
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              <span>Quản lý tất cả đơn</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                  <th className="py-3 px-4">Mã Đơn</th>
                  <th className="py-3 px-4">Khách Hàng</th>
                  <th className="py-3 px-4">Tổng Tiền</th>
                  <th className="py-3 px-4">Thanh Toán</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stats.recentOrders.map((order) => {
                  const st =
                    ORDER_STATUS_LABELS[order.status] || ORDER_STATUS_LABELS.PENDING;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        #{order.orderCode}
                        <div className="text-[11px] text-slate-400 font-normal">
                          {formatDateTime(order.createdAt)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{order.customerName}</div>
                        <div className="text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-rose-600">
                        {formatVND(order.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {order.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.badgeClass}`}
                        >
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột Cảnh báo sắp hết hàng & Thống kê trạng thái */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-600" />
              <span>Tỷ Lệ Trạng Thái Đơn Hàng</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              {Object.entries(ORDER_STATUS_LABELS).map(([key, info]) => {
                const count = (stats.statusBreakdown as any)[key] || 0;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50"
                  >
                    <span className={`font-bold ${info.colorClass}`}>{info.label}</span>
                    <span className="font-black text-slate-900">{count} đơn</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Các Quy Cách Sắp Hết Kho (&le; 10 túi)</span>
            </h3>
            {stats.lowStockVariants.length === 0 ? (
              <p className="text-xs text-slate-500">Tất cả mặt hàng đều còn tồn kho dồi dào.</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockVariants.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between text-xs border-b border-slate-100 pb-2"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-800 truncate">
                        {v.product.name}
                      </div>
                      <div className="text-slate-500">{v.weightLabel}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold shrink-0">
                      Còn {v.stock} túi
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

