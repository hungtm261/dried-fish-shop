import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  QrCode,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Phone,
  MapPin,
  User,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatVND } from '../../utils/format';
import { Order } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, shippingFee, totalAmount, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VIETQR'>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          shippingAddress,
          note,
          paymentMethod,
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Đặt hàng thất bại');
      }

      setCompletedOrder(data);
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra khi đặt hàng.');
    } finally {
      setSubmitting(false);
    }
  };

  // Màn hình Đặt hàng thành công
  if (completedOrder) {
    const qrUrl = `https://img.vietqr.io/image/MB-0367953683-compact2.png?amount=${completedOrder.totalAmount}&addInfo=${encodeURIComponent(
      `THANH TOAN ${completedOrder.orderCode}`
    )}&accountName=${encodeURIComponent('CA KHO TRANG HOA CAN GIO')}`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Đặt Hàng Thành Công
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Cảm Ơn {completedOrder.customerName} Đã Đặt Mua Đặc Sản!
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Mã đơn hàng của bạn là:{' '}
              <strong className="text-amber-700 font-black text-base">
                #{completedOrder.orderCode}
              </strong>
            </p>
          </div>

          {completedOrder.paymentMethod === 'VIETQR' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 max-w-sm mx-auto">
              <div className="text-xs font-bold text-amber-900 uppercase mb-2">
                Quét Mã VietQR Để Chuyển Khoản Nhanh
              </div>
              <img
                src={qrUrl}
                alt="VietQR"
                className="w-56 h-56 object-contain mx-auto rounded-xl border border-stone-200 bg-white p-2"
              />
              <p className="text-xs text-slate-600 mt-2">
                Số tiền: <strong>{formatVND(completedOrder.totalAmount)}</strong> • Nội dung:{' '}
                <strong>THANH TOAN {completedOrder.orderCode}</strong>
              </p>
            </div>
          )}

          <div className="bg-stone-50 rounded-2xl p-5 text-left text-xs space-y-2 border border-stone-200">
            <div className="font-bold text-slate-900 text-sm mb-2">Thông tin giao hàng:</div>
            <div>
              <span className="text-slate-500">Người nhận:</span>{' '}
              <strong>
                {completedOrder.customerName} - {completedOrder.customerPhone}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">Địa chỉ:</span>{' '}
              <strong>{completedOrder.shippingAddress}</strong>
            </div>
            <div>
              <span className="text-slate-500">Tổng thanh toán:</span>{' '}
              <strong className="text-rose-600 text-sm">
                {formatVND(completedOrder.totalAmount)}
              </strong>{' '}
              ({completedOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản VietQR'})
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={`/tra-cuu-don?query=${completedOrder.orderCode}`}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-3 rounded-xl"
            >
              Theo Dõi Trạng Thái Đơn Hàng
            </Link>
            <Link
              to="/danh-muc"
              className="bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-sm px-6 py-3 rounded-xl"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Giỏ hàng của bạn chưa có sản phẩm nào
        </h2>
        <Link
          to="/danh-muc"
          className="inline-flex items-center gap-2 bg-amber-600 text-white font-bold text-sm px-6 py-3 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chọn cá khô</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          to="/danh-muc"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Chọn thêm đặc sản khác</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Hoàn Tất Đơn Đặt Hàng Cá Khô
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Không cần tạo tài khoản — Chỉ cần để lại SĐT và Địa chỉ, vựa sẽ gọi xác nhận và đóng gói hút chân không gửi ngay.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột điền thông tin */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-stone-100 pb-3">
              1. Thông Tin Người Nhận Hàng
            </h2>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Họ và tên người nhận *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Số điện thoại liên hệ *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="VD: 0909123456"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Địa chỉ giao hàng chi tiết *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ghi chú đóng gói (Tùy chọn)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Hút chân không chia làm 2 túi nhỏ giúp mình để mang đi nước ngoài..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-stone-100 pb-3">
              2. Phương Thức Thanh Toán
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-2 border-amber-600 bg-amber-50/70'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    Thanh toán khi nhận hàng (COD)
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Kiểm tra đúng loại cá khô, đúng trọng lượng mới thanh toán cho shipper.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('VIETQR')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'VIETQR'
                    ? 'border-2 border-amber-600 bg-amber-50/70'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <QrCode className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    Chuyển khoản nhanh VietQR
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Tự động tạo mã QR ngân hàng đúng số tiền ngay sau khi bấm đặt hàng.
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Cột Tóm tắt đơn hàng */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs sticky top-24 space-y-5">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-stone-100 pb-3">
              Chi Tiết Giỏ Hàng ({items.length} món)
            </h2>

            <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="py-3 flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {item.productName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.weightLabel} × {item.quantity}
                    </div>
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {formatVND(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-stone-200 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính:</span>
                <span className="font-semibold text-slate-900">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold text-emerald-700">
                  {shippingFee === 0 ? 'Miễn phí (Đơn >= 500k)' : formatVND(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-stone-200">
                <span>Tổng cộng:</span>
                <span className="text-xl text-rose-600">{formatVND(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black py-4 px-6 rounded-2xl shadow-lg transition-all text-sm sm:text-base"
            >
              {submitting ? 'Đang xử lý đơn hàng...' : 'XÁC NHẬN ĐẶT HÀNG NGAY'}
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Thông tin khách hàng được bảo mật tuyệt đối</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

