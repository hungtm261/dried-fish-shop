import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CustomerLayout } from './components/CustomerLayout';
import { AdminLayout } from './components/AdminLayout';
import { HomePage } from './pages/portal/HomePage';
import { CatalogPage } from './pages/portal/CatalogPage';
import { ProductDetailPage } from './pages/portal/ProductDetailPage';
import { CheckoutPage } from './pages/portal/CheckoutPage';
import { OrderLookupPage } from './pages/portal/OrderLookupPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';

export const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* PORTAL KHÁCH HÀNG */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="danh-muc" element={<CatalogPage />} />
            <Route path="san-pham/:slug" element={<ProductDetailPage />} />
            <Route path="thanh-toan" element={<CheckoutPage />} />
            <Route path="tra-cuu-don" element={<OrderLookupPage />} />
          </Route>

          {/* TRANG QUẢN TRỊ ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;

