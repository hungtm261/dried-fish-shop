import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatVND } from '../utils/format';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    totalAmount,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShipRemaining = Math.max(0, 500000 - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold">Giỏ Hàng Đặc Sản</h2>
              <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-2 py-0.5 rounded-full">
                {items.length} món
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Thanh tiến trình Freeship */}
          {items.length > 0 && (
            <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 text-xs text-amber-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              {freeShipRemaining > 0 ? (
                <span>
                  Mua thêm <strong>{formatVND(freeShipRemaining)}</strong> để được{' '}
                  <strong className="text-emerald-700">MIỄN PHÍ VẬN CHUYỂN</strong> toàn quốc!
                </span>
              ) : (
                <span className="font-semibold text-emerald-700">
                  🎉 Đơn hàng của bạn đã được MIỄN PHÍ VẬN CHUYỂN!
                </span>
              )}
            </div>
          )}

          {/* Danh sách sản phẩm */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-200">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-slate-700 font-semibold mb-1">Giỏ hàng đang trống</p>
                <p className="text-xs text-slate-500 max-w-xs mb-5">
                  Hãy chọn thêm các loại khô cá dứa 1 nắng, khô cá lóc đồng Cà Mau hoặc mực khô Phú Quốc nhé!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/danh-muc');
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Khám phá đặc sản ngay
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variantId} className="py-4 flex gap-3.5">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/san-pham/${item.productSlug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="font-bold text-sm text-slate-900 hover:text-amber-700 line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    <div className="inline-block mt-1 px-2 py-0.5 bg-stone-100 text-slate-700 rounded text-xs font-medium">
                      Quy cách: {item.weightLabel}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-rose-600">
                        {formatVND(item.unitPrice * item.quantity)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="ml-1 p-1.5 text-slate-400 hover:text-rose-600"
                          title="Xóa món"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer thanh toán */}
          {items.length > 0 && (
            <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính:</span>
                  <span className="font-semibold text-slate-900">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí đóng thùng & giao hàng:</span>
                  <span className="font-semibold text-emerald-700">
                    {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-stone-200">
                  <span>Tổng thanh toán:</span>
                  <span className="text-rose-600 text-lg">{formatVND(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/thanh-toan');
                }}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

