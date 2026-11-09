import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Category } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const loadCategories = () => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, imageUrl }),
    });
    if (res.ok) {
      setName('');
      setDescription('');
      setImageUrl('');
      loadCategories();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xóa danh mục này sẽ xóa các sản phẩm thuộc danh mục. Tiếp tục?')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    loadCategories();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-fit">
        <h2 className="text-lg font-black text-slate-900 mb-4">Thêm Danh Mục Cá Khô</h2>
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tên danh mục *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Cá Khô Tẩm Gia Vị Ăn Liền"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả hiển thị trên thẻ danh mục ở trang chủ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Link ảnh đại diện</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Để trống sẽ dùng ảnh mặc định"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Danh Mục</span>
          </button>
        </form>
      </div>

      <div className="lg:col-span-7 space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-4 shadow-xs"
          >
            <div className="flex items-center gap-4">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <div className="font-bold text-sm text-slate-900">{cat.name}</div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{cat.description}</p>
                <span className="inline-block mt-1 text-[11px] font-bold text-amber-700">
                  {cat._count?.products || 0} sản phẩm đang bán
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(cat.id)}
              className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

