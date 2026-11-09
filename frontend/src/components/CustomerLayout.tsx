import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  PhoneCall,
  ShieldCheck,
  PackageSearch,
  LayoutDashboard,
  Menu,
  X,
  MapPin,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';

export const CustomerLayout: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [searchText, setSearchText] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/danh-muc?search=${encodeURIComponent(searchText.trim())}`);
      setMobileMenuOpen(false);
    } else {
      navigate('/danh-muc');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-amber-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              CÁ KHÔ TRANG HÒA • CẦN GIỜ (ESTD. 2000) — Phơi nắng tự nhiên trên giàn lưới
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-amber-300 font-semibold">
              📦 Khách lấy sỉ có bảng giá riêng • Liên hệ Cô Thao: 0367 953 683
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              to="/tra-cuu-don"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <PackageSearch className="w-3.5 h-3.5 text-amber-400" />
              <span>Tra cứu đơn hàng</span>
            </Link>
            <Link
              to="/admin"
              className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Trang Quản Trị (Admin)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo Trang Hòa */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/images/products/logo-trang-hoa.jpg"
              alt="Cá Khô Trang Hòa Cần Giờ"
              className="w-12 h-12 rounded-xl object-contain border border-stone-200 bg-white p-0.5 shadow-xs"
            />
            <div>
              <span className="block font-black text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                CÁ KHÔ TRANG HÒA
              </span>
              <span className="block text-[11px] font-bold text-amber-700 tracking-wide mt-1">
                CẦN GIỜ • ESTD. 2000 • BIỂN / BỀN / THẬT
              </span>
            </div>
          </Link>

          {/* Thanh tìm kiếm */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Tìm cá dứa 1-4 nắng, cá dứa phi lê, cá dứa tẩm vị, cá sặc, cá đù, cá đuối..."
                className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-amber-700"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Menu điều hướng Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? 'text-amber-700' : 'hover:text-amber-700 transition-colors'
              }
            >
              Trang Chủ
            </NavLink>
            <NavLink
              to="/danh-muc"
              className={({ isActive }) =>
                isActive ? 'text-amber-700' : 'hover:text-amber-700 transition-colors'
              }
            >
              Danh Mục & Bảng Giá
            </NavLink>
            <NavLink
              to="/tra-cuu-don"
              className={({ isActive }) =>
                isActive ? 'text-amber-700' : 'hover:text-amber-700 transition-colors'
              }
            >
              Kiểm Tra Đơn
            </NavLink>
          </nav>

          {/* Hotline Cô Thao & Giỏ hàng */}
          <div className="flex items-center gap-3">
            <a
              href="tel:0367953683"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-slate-500 font-semibold">
                  Liên hệ Cô Thao
                </span>
                <span className="block text-xs font-extrabold text-amber-800">
                  0367 953 683
                </span>
              </div>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Giỏ hàng</span>
              <span className="bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-stone-200 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Tìm tên loại cá khô..."
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-stone-300"
              />
              <button
                type="submit"
                className="bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
              >
                Tìm
              </button>
            </form>
            <div className="flex flex-col space-y-2 text-sm font-bold text-slate-800 pt-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                Trang Chủ
              </Link>
              <Link to="/danh-muc" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                Danh Mục & Bảng Giá Sản Phẩm
              </Link>
              <Link to="/tra-cuu-don" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                Tra Cứu Đơn Hàng
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-amber-700"
              >
                Chuyển sang Trang Quản Trị (Admin)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Nội dung trang */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/products/logo-trang-hoa.jpg"
                alt="Trang Hòa"
                className="w-10 h-10 rounded-xl bg-white p-0.5 object-contain"
              />
              <div>
                <span className="font-black text-base text-white block leading-none">
                  CÁ KHÔ TRANG HÒA
                </span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  CẦN GIỜ • ESTD. 2000
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Hương vị từ biển Cần Giờ — Mang hương vị biển Cần Giờ đến mọi nhà. Chuyên sỉ & lẻ Cá dứa 1-2-3-4 nắng, Cá dứa phi lê, Cá dứa tẩm vị, Khô cá sặc, Khô cá đù, Khô cá đuối phơi giàn lưới tự nhiên.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Xuất xứ: Vựa Cá Khô Trang Hòa - Cần Giờ, TP. Hồ Chí Minh</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              6 Sản Phẩm Chủ Lực
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link
                  to="/san-pham/kho-ca-dua-can-gio-1-2-3-4-nang"
                  className="hover:text-amber-400"
                >
                  01. Cá dứa 1-2-3-4 nắng (240k - 420k/kg)
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham/ca-dua-phi-le-hut-chan-khong"
                  className="hover:text-amber-400"
                >
                  02. Cá dứa phi lê đóng gói hút chân không
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham/kho-ca-dua-tam-vi-cat-khoanh"
                  className="hover:text-amber-400"
                >
                  03. Cá khô dứa tẩm vị cắt khoanh (260k - 450k/kg)
                </Link>
              </li>
              <li>
                <Link to="/san-pham/kho-ca-sac-can-gio" className="hover:text-amber-400">
                  04. Khô cá sặc xẻ phơi khô (260k/kg)
                </Link>
              </li>
              <li>
                <Link to="/san-pham/kho-ca-du-phoi-nang-tu-nhien" className="hover:text-amber-400">
                  05. Khô cá Đù nhỏ & lớn (130k - 150k/kg)
                </Link>
              </li>
              <li>
                <Link to="/san-pham/kho-ca-duoi-can-gio" className="hover:text-amber-400">
                  06. Khô cá đuối xẻ miếng (180k/kg)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Hướng Dẫn Bảo Quản Chuẩn
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>• Cắt nhỏ để vào hộp nhựa có nắp đậy kín</li>
              <li>• Để vào ngăn đá tủ lạnh hoặc tủ đông</li>
              <li>• Lấy ra 15 phút (Không rửa nước) trước khi sử dụng</li>
              <li>• Cách sử dụng: Chiên hoặc Nướng</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Liên Hệ Đặt Lẻ & Báo Giá Sỉ
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Khách lấy sỉ có bảng giá riêng. Số lượng càng nhiều càng có thể thương lượng giá tốt hơn ạ.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
              <div className="text-xs text-slate-300 font-semibold">LIÊN HỆ CÔ THAO (Zalo / SĐT):</div>
              <a
                href="tel:0367953683"
                className="block text-xl font-black text-amber-400 mt-0.5 hover:underline"
              >
                0367 953 683
              </a>
              <div className="text-[11px] text-emerald-400 mt-1">
                BIỂN / BỀN / THẬT • Giao hàng toàn quốc
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span>© 2000 - 2026 Cá Khô Trang Hòa • Cần Giờ. Hương vị từ biển Cần Giờ.</span>
          <Link to="/admin" className="text-amber-400 hover:underline font-medium">
            Truy cập Hệ thống Quản trị Admin →
          </Link>
        </div>
      </footer>

      {/* Slide-over Cart */}
      <CartDrawer />
    </div>
  );
};
