import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatVND } from '../utils/format';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const variants = product.variants || [];
  const currentVariant = variants[selectedVariantIdx] || variants[0];

  if (!currentVariant) return null;

  const currentPrice = currentVariant.salePrice ?? currentVariant.price;
  const hasDiscount =
    currentVariant.salePrice !== null && currentVariant.salePrice < currentVariant.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((currentVariant.price - (currentVariant.salePrice || 0)) / currentVariant.price) * 100
      )
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Ảnh sản phẩm */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Link to={`/san-pham/${product.slug}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Nhãn quảng cáo & giảm giá */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
              <Sparkles className="w-3 h-3" />
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white w-fit shadow-sm">
              Giảm {discountPercent}%
            </span>
          )}
        </div>

        {/* Xuất xứ vùng miền */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/75 backdrop-blur-sm text-amber-200 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate max-w-[180px]">{product.origin}</span>
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-4 flex-1 flex flex-col">
        {product.category && (
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
            {product.category.name}
          </span>
        )}

        <Link
          to={`/san-pham/${product.slug}`}
          className="font-bold text-slate-900 hover:text-amber-700 line-clamp-2 text-base leading-snug mb-2 transition-colors"
        >
          {product.name}
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.description}</p>

        {/* Chọn nhanh quy cách đóng gói (250g / 500g / 1kg) */}
        <div className="mt-auto pt-2">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {variants.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariantIdx(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  idx === selectedVariantIdx
                    ? 'bg-amber-50 border-amber-600 text-amber-800 shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-slate-600 hover:border-stone-300'
                }`}
              >
                {v.weightLabel}
              </button>
            ))}
          </div>

          {/* Giá & nút thêm giỏ hàng */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
            <div>
              <div className="text-lg font-extrabold text-rose-600 leading-none">
                {formatVND(currentPrice)}
              </div>
              {hasDiscount && (
                <div className="text-xs text-slate-400 line-through mt-0.5">
                  {formatVND(currentVariant.price)}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => addToCart(product, currentVariant, 1)}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Chọn mua</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

