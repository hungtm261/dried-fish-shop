import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  ShoppingCart,
  ExternalLink,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navItems = [
    { to: '/admin', label: 'Tổng Quan & Doanh Thu', icon: LayoutDashboard, end: true },
    { to: '/admin/orders', label: 'Quản Lý Đơn Hàng', icon: ShoppingCart },
    { to: '/admin/products', label: 'Quản Lý Cá Khô (SP)', icon: Package },
    { to: '/admin/categories', label: 'Quản Lý Danh Mục', icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/products/logo-trang-hoa.jpg"
              alt="Trang Hòa"
              className="w-10 h-10 rounded-xl bg-white p-0.5 object-contain"
            />
            <div>
              <div className="font-black text-white text-sm tracking-wide">
                TRANG HÒA ADMIN
              </div>
              <div className="text-[11px] text-amber-400">Cá Khô Cần Giờ • 0367 953 683</div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-colors"
          >
            <span>Xem Trang Bán Hàng (Portal)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">
              Quản Trị Cửa Hàng Cá Khô Trang Hòa • Cần Giờ (Cô Thao - 0367 953 683)
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              ● Đang hoạt động
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
