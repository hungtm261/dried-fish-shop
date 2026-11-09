import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  ShieldCheck,
  Truck,
  ArrowRight,
  Flame,
  Award,
  PhoneCall,
  Snowflake,
  Package,
} from 'lucide-react';
import { Category, Product } from '../../types';
import { ProductCard } from '../../components/ProductCard';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ])
      .then(([cats, prods]) => {
        setCategories(cats);
        setFeaturedProducts(prods);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16">
      {/* HERO BANNER QUẢNG CÁO TRANG HÒA - CẦN GIỜ */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-35 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/products/img-7.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-22 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>CÁ KHÔ TRANG HÒA • CẦN GIỜ (ESTD. 2000)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Hương Vị Từ <span className="text-amber-400">Biển Cần Giờ</span> — Mang Đến Mọi Nhà
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Chuyên các loại <strong>Cá Dứa 1-2-3-4 Nắng</strong> phơi trên giàn lưới,{' '}
              <strong>Cá Dứa Phi Lê</strong> hút chân không, <strong>Cá Dứa Tẩm Vị</strong> cắt khoanh, cùng{' '}
              <strong>Khô Cá Sặc, Khô Cá Đù, Khô Cá Đuối</strong> tươi ngon chuẩn gốc Cần Giờ.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/danh-muc"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-7 py-4 rounded-2xl shadow-lg shadow-amber-500/20 transition-all text-sm sm:text-base"
              >
                <span>Xem 6 Sản Phẩm & Đặt Mua</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#bang-gia-trang-hoa"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-4 rounded-2xl transition-all text-sm sm:text-base"
              >
                <span>Xem Bảng Giá Niêm Yết</span>
              </a>
            </div>

            {/* Chỉ số uy tín */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-400">ESTD. 2000</div>
                <div className="text-xs text-slate-400">Thương hiệu Trang Hòa</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-400">1 - 4 Nắng</div>
                <div className="text-xs text-slate-400">Phơi giàn lưới tự nhiên</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-400">Sỉ & Lẻ</div>
                <div className="text-xs text-slate-400">Cô Thao: 0367 953 683</div>
              </div>
            </div>
          </div>

          {/* Thẻ Quảng cáo Thực tế bên phải */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="/images/products/img-6.jpg"
                  alt="Khô Cá Dứa Trang Hòa Cần Giờ"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                  ★ Phơi Nắng Tự Nhiên Trên Giàn Lưới
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-amber-400 uppercase">
                  Đặc Sản Chủ Lực • Cá Khô Trang Hòa
                </div>
                <h3 className="text-xl font-black text-white">
                  Khô Cá Dứa Cần Giờ (1 - 2 - 3 - 4 Nắng)
                </h3>
                <p className="text-xs text-slate-300">
                  Thịt dày, ngọt tự nhiên, chọn theo độ nắng từ 240.000đ/kg (1 nắng) đến 420.000đ/kg (4 nắng).
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs text-slate-400 block">Giá niêm yết từ:</span>
                  <span className="text-2xl font-black text-amber-400">240.000đ</span>
                  <span className="text-xs text-slate-300"> / kg</span>
                </div>
                <Link
                  to="/san-pham/kho-ca-dua-can-gio-1-2-3-4-nang"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl"
                >
                  Chọn Độ Nắng →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CAM KẾT VÀNG CỦA TRANG HÒA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Sun,
              title: 'Phơi Trên Giàn Lưới Tự Nhiên',
              desc: 'Cá tươi xẻ và phơi trực tiếp trên giàn lưới cao ráo dưới nắng biển Cần Giờ, sạch sẽ và thơm ngon.',
            },
            {
              icon: Award,
              title: 'Đủ Độ Nắng 1 - 2 - 3 - 4 Nắng',
              desc: 'Đáp ứng mọi khẩu vị khách ăn liền, làm quà biếu hoặc đóng thùng gửi đi xa.',
            },
            {
              icon: ShieldCheck,
              title: 'Đóng Gói Hút Chân Không',
              desc: 'Từng túi cá đều có tem hướng dẫn bảo quản và cách sử dụng rõ ràng của Trang Hòa.',
            },
            {
              icon: Truck,
              title: 'Bỏ Sỉ & Lẻ Giá Tận Xưởng',
              desc: 'Khách lấy sỉ số lượng càng nhiều giá càng tốt. Liên hệ trực tiếp Cô Thao 0367 953 683.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-md flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6 SẢN PHẨM THỰC TẾ HIỆN CÓ CỦA CÁ KHÔ TRANG HÒA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-700">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Danh Mục Hiện Có • Cá Khô Trang Hòa Cần Giờ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              6 Sản Phẩm Đặc Sản Chủ Lực Tại Vựa
            </h2>
          </div>
          <Link
            to="/danh-muc"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors"
          >
            <span>Xem tất cả & Lọc theo danh mục</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-stone-200/70 animate-pulse border border-stone-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* BẢNG GIÁ NIÊM YẾT TRỰC QUAN & POSTER DANH MỤC TRANG HÒA */}
      <section id="bang-gia-trang-hoa" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                BIỂN / BỀN / THẬT • Mang Hương Vị Biển Cần Giờ Đến Mọi Nhà
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                Bảng Giá Sản Phẩm Niêm Yết — Cá Khô Trang Hòa
              </h2>
            </div>
            <a
              href="tel:0367953683"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Liên hệ Cô Thao: 0367 953 683</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Bảng giá nhanh dạng danh sách tương tác */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-amber-400">01 & 02. Khô Cá Dứa Cần Giờ</h3>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold">
                    Thịt dày, ngọt tự nhiên • Chọn theo độ nắng
                  </span>
                </div>
                <div className="divide-y divide-slate-700/70 text-sm">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-200">Khô cá dứa 1 nắng</span>
                    <span className="font-black text-amber-400">240.000đ / kg</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-200">Khô cá dứa 2 nắng</span>
                    <span className="font-black text-amber-400">320.000đ / kg</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-200">Khô cá dứa 3 nắng</span>
                    <span className="font-black text-amber-400">350.000đ / kg</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-200">Khô cá dứa 4 nắng</span>
                    <span className="font-black text-amber-400">420.000đ / kg</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-amber-400">03. Khô Cá Dứa Tẩm Vị</h3>
                  <span className="text-xs bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-full font-bold">
                    Vị mới • Bán chạy
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-slate-200">Cắt khoanh, tẩm ớt, đóng gói hút chân không</span>
                  <span className="font-black text-amber-400">260.000đ – 450.000đ / kg</span>
                </div>
                <p className="text-xs text-slate-400">
                  Giá tùy theo độ nắng và loại tẩm. Liên hệ Cô Thao để được tư vấn hương vị phù hợp.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5">
                  <div className="text-xs text-slate-400 font-bold">04. KHÔ CÁ SẶC</div>
                  <div className="text-sm font-bold text-white mt-1">Cá sặc xẻ, phơi khô</div>
                  <div className="text-lg font-black text-amber-400 mt-2">260.000đ / kg</div>
                </div>

                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5">
                  <div className="text-xs text-slate-400 font-bold">05. KHÔ CÁ ĐÙ</div>
                  <div className="text-xs text-slate-200 mt-1">
                    Cá đù nhỏ: <strong className="text-amber-400">130.000đ/kg</strong>
                  </div>
                  <div className="text-xs text-slate-200 mt-1">
                    Cá đù lớn: <strong className="text-amber-400">150.000đ/kg</strong>
                  </div>
                </div>

                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5">
                  <div className="text-xs text-slate-400 font-bold">06. KHÔ CÁ ĐUỐI</div>
                  <div className="text-sm font-bold text-white mt-1">Dai ngọt, thơm đặc trưng</div>
                  <div className="text-lg font-black text-amber-400 mt-2">180.000đ / kg</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 rounded-2xl p-5 flex items-center gap-4">
                <Package className="w-8 h-8 shrink-0" />
                <div>
                  <div className="font-black text-sm sm:text-base">
                    Khách lấy sỉ có bảng giá riêng
                  </div>
                  <div className="text-xs font-medium">
                    Số lượng càng nhiều càng có thể thương lượng giá tốt hơn ạ. Liên hệ Cô Thao{' '}
                    <strong>0367 953 683</strong> để được báo giá sỉ.
                  </div>
                </div>
              </div>
            </div>

            {/* 2 Poster thực tế của cửa hàng */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <a
                href="/images/products/danh-muc-trang-hoa.jpg"
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-lg"
              >
                <img
                  src="/images/products/danh-muc-trang-hoa.jpg"
                  alt="Danh mục sản phẩm Cá Khô Trang Hòa"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                />
              </a>
              <a
                href="/images/products/bang-gia-trang-hoa.jpg"
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-lg"
              >
                <img
                  src="/images/products/bang-gia-trang-hoa.jpg"
                  alt="Bảng giá sản phẩm Cá Khô Trang Hòa"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HÌNH ẢNH THỰC TẾ GIÀN PHƠI & ĐÓNG GÓI TẠI TRANG HÒA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
              Hình Ảnh Thực Tế 100% Tại Cần Giờ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Giàn Lưới Phơi Nắng & Quy Cách Đóng Gói Hút Chân Không
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
            <Snowflake className="w-4 h-4 text-sky-600" />
            <span>Bảo quản ngăn đá • Lấy ra 15 phút (Không rửa nước) trước khi chiên/nướng</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { src: '/images/products/img-7.jpg', caption: 'Giàn lưới phơi cá dứa dưới nắng Cần Giờ' },
            { src: '/images/products/img-2.jpg', caption: 'Đóng gói hút chân không kèm nhãn bảo quản' },
            { src: '/images/products/img-5.jpg', caption: 'Cá dứa phi lê dẻo thơm tự nhiên' },
            { src: '/images/products/img-1.jpg', caption: 'Khô cá sặc xẻ phơi trên giàn lưới' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-stone-200 bg-stone-100 shadow-xs"
            >
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent p-3">
                <p className="text-xs font-semibold text-white">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
