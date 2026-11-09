import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star, X } from 'lucide-react';
import { Category, Product } from '../../types';
import { formatVND } from '../../utils/format';

interface VariantForm {
  weightLabel: string;
  price: number;
  salePrice: number | '';
  stock: number;
}

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [origin, setOrigin] = useState('');
  const [badge, setBadge] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [storageGuide, setStorageGuide] = useState('');
  const [cookingTips, setCookingTips] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [variants, setVariants] = useState<VariantForm[]>([
    { weightLabel: 'Túi 500g', price: 200000, salePrice: 180000, stock: 30 },
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        fetch('/api/products?includeInactive=true').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
      ]);
      setProducts(prods);
      setCategories(cats);
      if (cats.length > 0 && !categoryId) setCategoryId(cats[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || 1);
    setOrigin('Cà Mau');
    setBadge('Đặc Sản Mới');
    setImageUrl('https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80');
    setDescription('');
    setStorageGuide('Bảo quản ngăn đông tủ lạnh 6 tháng.');
    setCookingTips('Chiên vàng hoặc nướng than hoa.');
    setIsFeatured(true);
    setIsActive(true);
    setVariants([
      { weightLabel: 'Túi 500g', price: 200000, salePrice: 180000, stock: 30 },
      { weightLabel: 'Túi 1kg', price: 380000, salePrice: 340000, stock: 20 },
    ]);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setOrigin(p.origin);
    setBadge(p.badge || '');
    setImageUrl(p.imageUrl);
    setDescription(p.description);
    setStorageGuide(p.storageGuide);
    setCookingTips(p.cookingTips);
    setIsFeatured(p.isFeatured);
    setIsActive(p.isActive);
    setVariants(
      p.variants.map((v) => ({
        weightLabel: v.weightLabel,
        price: v.price,
        salePrice: v.salePrice ?? '',
        stock: v.stock,
      }))
    );
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      categoryId,
      origin,
      badge: badge || null,
      imageUrl,
      description,
      storageGuide,
      cookingTips,
      isFeatured,
      isActive,
      variants: variants.map((v) => ({
        weightLabel: v.weightLabel,
        price: Number(v.price),
        salePrice: v.salePrice === '' ? null : Number(v.salePrice),
        stock: Number(v.stock),
      })),
    };

    const url = editingProduct
      ? `/api/admin/products/${editingProduct.id}`
      : '/api/admin/products';
    const method = editingProduct ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setModalOpen(false);
      loadData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm cá khô này?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Quản Lý Sản Phẩm Cá Khô ({products.length})
          </h2>
          <p className="text-xs text-slate-500">
            Thêm mới, chỉnh sửa giá theo từng mức trọng lượng (250g/500g/1kg) và bật quảng cáo Trang chủ
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Loại Cá Khô Mới</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                <th className="py-3.5 px-4">Sản Phẩm</th>
                <th className="py-3.5 px-4">Danh Mục & Xuất Xứ</th>
                <th className="py-3.5 px-4">Quy Cách & Bảng Giá</th>
                <th className="py-3.5 px-4">Quảng Cáo</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Đang tải danh sách cá khô...
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                          {p.badge && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{p.category?.name}</div>
                      <div className="text-slate-500">{p.origin}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {p.variants.map((v) => (
                          <div key={v.id} className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-100 rounded font-semibold text-slate-700">
                              {v.weightLabel}
                            </span>
                            <span className="font-bold text-rose-600">
                              {formatVND(v.salePrice ?? v.price)}
                            </span>
                            <span className="text-slate-400">(Kho: {v.stock})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.isFeatured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Nổi bật Trang chủ
                        </span>
                      ) : (
                        <span className="text-slate-400">Thường</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm / Sửa */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                {editingProduct ? 'Chỉnh Sửa Sản Phẩm Cá Khô' : 'Thêm Sản Phẩm Cá Khô Mới'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Tên sản phẩm cá khô *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh mục *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Xuất xứ vùng miền</label>
                  <input
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="VD: Cà Mau, Cần Giờ..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nhãn quảng cáo (Badge)</label>
                  <input
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="VD: Bán Chạy Số 1, Chuẩn 1 Nắng..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Link ảnh sản phẩm</label>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span>Hiển thị Quảng cáo Nổi bật ở Trang chủ</span>
                </label>
              </div>

              {/* Bảng biến thể trọng lượng */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Quy cách đóng gói & Giá bán (250g / 500g / 1kg)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setVariants([
                        ...variants,
                        { weightLabel: 'Túi 1kg', price: 350000, salePrice: 320000, stock: 20 },
                      ])
                    }
                    className="text-amber-700 font-bold hover:underline"
                  >
                    + Thêm mức trọng lượng
                  </button>
                </div>

                {variants.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 items-center bg-slate-50 p-2.5 rounded-xl">
                    <input
                      placeholder="Quy cách (VD: Túi 500g)"
                      value={v.weightLabel}
                      onChange={(e) => {
                        const next = [...variants];
                        next[idx].weightLabel = e.target.value;
                        setVariants(next);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Giá gốc"
                      value={v.price}
                      onChange={(e) => {
                        const next = [...variants];
                        next[idx].price = Number(e.target.value);
                        setVariants(next);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Giá KM"
                      value={v.salePrice}
                      onChange={(e) => {
                        const next = [...variants];
                        next[idx].salePrice = e.target.value === '' ? '' : Number(e.target.value);
                        setVariants(next);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="Kho"
                        value={v.stock}
                        onChange={(e) => {
                          const next = [...variants];
                          next[idx].stock = Number(e.target.value);
                          setVariants(next);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                          className="text-rose-600 px-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

