import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  Snowflake,
  Utensils,
  ShoppingBag,
  CheckCircle2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
} from 'lucide-react';
import { Product } from '../../types';
import { formatVND } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => {
        setProduct(data.product);
        setRelated(data.relatedProducts || []);
        setSelectedVariantIdx(0);
        setQuantity(1);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-96 rounded-3xl bg-stone-200 animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy sản phẩm</h2>
        <Link
          to="/danh-muc"
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại cửa hàng</span>
        </Link>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const currentPrice = currentVariant.salePrice ?? currentVariant.price;
  const hasDiscount =
    currentVariant.salePrice !== null && currentVariant.salePrice < currentVariant.price;

  const handleBuyNow = () => {
    addToCart(product, currentVariant, quantity);
    navigate('/thanh-toan');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-700">
          Trang chủ
        </Link>
        <span>/</span>
        <Link to="/danh-muc" className="hover:text-amber-700">
          Đặc sản cá khô
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate">{product.name}</span>
      </div>

      {/* Khối thông tin chính */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cột ảnh */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 border border-stone-200">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
                ★ {product.badge}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-700">Hút chân không 2 lớp</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-700">Không chất bảo quản</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-700">Đổi trả 1-1 tận nơi</span>
            </div>
          </div>
        </div>

        {/* Cột chọn trọng lượng & đặt mua */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {product.category && (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                {product.category.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Xuất xứ: {product.origin}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug mb-3">
            {product.name}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">{product.description}</p>

          {/* Giá theo quy cách đang chọn */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 mb-6 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                Giá bán ({currentVariant.weightLabel}):
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-rose-600">
                  {formatVND(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through font-medium">
                    {formatVND(currentVariant.price)}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Còn {currentVariant.stock} túi tại kho
            </span>
          </div>

          {/* Chọn quy cách đóng gói */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Chọn quy cách đóng gói (Hút chân không):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.variants.map((v, idx) => {
                const vPrice = v.salePrice ?? v.price;
                const active = idx === selectedVariantIdx;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      active
                        ? 'border-2 border-amber-600 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-amber-400'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900">{v.weightLabel}</div>
                    <div className="text-xs font-extrabold text-rose-600 mt-0.5">
                      {formatVND(vPrice)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Số lượng & nút đặt hàng */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-slate-600 hover:text-slate-900"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-slate-600 hover:text-slate-900"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => addToCart(product, currentVariant, quantity)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Thêm Vào Giỏ Hàng</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3.5 px-6 rounded-xl transition-all"
            >
              Mua Ngay
            </button>
          </div>

          {/* Hướng dẫn bảo quản & chế biến */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-stone-200 mt-auto">
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80">
              <div className="flex items-center gap-2 font-bold text-xs text-sky-900 uppercase mb-1.5">
                <Snowflake className="w-4 h-4 text-sky-600" />
                <span>Cách Bảo Quản Chuẩn</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{product.storageGuide}</p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80">
              <div className="flex items-center gap-2 font-bold text-xs text-orange-900 uppercase mb-1.5">
                <Utensils className="w-4 h-4 text-orange-600" />
                <span>Gợi Ý Món Ngon</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{product.cookingTips}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Truck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000đ. Nhận hàng kiểm tra mới thanh toán.
            </span>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Các Loại Đặc Sản Khác Cùng Nhóm
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

