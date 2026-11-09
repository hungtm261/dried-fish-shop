import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, RotateCcw } from 'lucide-react';
import { Category, Product } from '../../types';
import { ProductCard } from '../../components/ProductCard';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const [selectedOrigin, setSelectedOrigin] = useState('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  const origins = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.origin) set.add(p.origin);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedOrigin !== 'all') {
      list = list.filter((p) => p.origin === selectedOrigin);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => {
        const pa = a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0;
        const pb = b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0;
        return pa - pb;
      });
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => {
        const pa = a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0;
        const pb = b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0;
        return pb - pa;
      });
    }

    return list;
  }, [products, selectedOrigin, sortBy]);

  const handleCategoryChange = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    if (slug === 'all') next.delete('category');
    else next.set('category', slug);
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setSelectedOrigin('all');
    setSortBy('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Cửa Hàng Đặc Sản Chính Gốc
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Danh Mục Cá Khô & Hải Sản Khô
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Chọn quy cách đóng gói 250g, 500g hoặc 1kg trực tiếp trên từng sản phẩm.
          </p>
        </div>

        {/* Tìm kiếm nhanh */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set('search', e.target.value);
              else next.delete('search');
              setSearchParams(next);
            }}
            placeholder="Lọc theo tên cá, vùng miền..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Bộ lọc Danh mục ngang */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === 'all'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white border border-stone-200 text-slate-700 hover:border-amber-400'
          }`}
        >
          Tất Cả Đặc Sản
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => handleCategoryChange(c.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === c.slug
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-slate-700 hover:border-amber-400'
            }`}
          >
            {c.name} ({c._count?.products || 0})
          </button>
        ))}
      </div>

      {/* Thanh công cụ lọc Xuất xứ & Sắp xếp */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-amber-600" />
            <span>Xuất xứ vùng miền:</span>
          </div>
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-stone-300 px-3 py-2 bg-stone-50 focus:outline-none focus:border-amber-600"
          >
            <option value="all">Tất cả vùng miền</option>
            {origins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Sắp xếp giá:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold rounded-xl border border-stone-300 px-3 py-2 bg-stone-50 focus:outline-none focus:border-amber-600"
          >
            <option value="default">Mặc định (Nổi bật nhất)</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>

          {(selectedCategory !== 'all' || searchQuery || selectedOrigin !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Lưới sản phẩm */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
          <p className="text-lg font-bold text-slate-800 mb-2">
            Không tìm thấy sản phẩm cá khô phù hợp
          </p>
          <p className="text-xs text-slate-500 mb-5">
            Bạn hãy thử xóa bộ lọc hoặc tìm với từ khóa khác nhé.
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-amber-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
          >
            Xem tất cả đặc sản
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

