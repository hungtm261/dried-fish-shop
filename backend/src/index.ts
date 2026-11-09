import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Helper tạo slug tiếng Việt chuẩn
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ==========================================
// 1. PUBLIC API (PORTAL KHÁCH HÀNG)
// ==========================================

// Lấy danh sách danh mục
app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { id: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tải danh mục' });
  }
});

// Lấy danh sách sản phẩm cá khô (hỗ trợ lọc theo categorySlug, search, featured, origin)
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, featured, origin, includeInactive } = req.query;

    const whereClause: any = {};

    if (includeInactive !== 'true') {
      whereClause.isActive = true;
    }

    if (category && category !== 'all') {
      whereClause.category = {
        slug: String(category),
      };
    }

    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    if (origin && origin !== 'all') {
      whereClause.origin = {
        contains: String(origin),
      };
    }

    if (search) {
      const q = String(search).trim();
      whereClause.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { origin: { contains: q } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
        },
      },
      orderBy: [{ id: 'asc' }],
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tải danh sách sản phẩm' });
  }
});

// Chi tiết sản phẩm theo slug
app.get('/api/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Lấy sản phẩm cùng danh mục gợi ý
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      include: {
        category: true,
        variants: { orderBy: { price: 'asc' } },
      },
      take: 4,
    });

    res.json({ product, relatedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tải chi tiết sản phẩm' });
  }
});

// Đặt hàng mới (Guest Checkout)
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerPhone, shippingAddress, note, paymentMethod, items } = req.body;

    if (!customerName || !customerPhone || !shippingAddress || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin nhận hàng và giỏ hàng.' });
    }

    // Kiểm tra và tính toán giá từ DB
    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: Number(item.variantId) },
        include: { product: true },
      });

      if (!variant) {
        return res.status(400).json({ message: `Phân loại sản phẩm không tồn tại.` });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = variant.salePrice ?? variant.price;
      subtotal += unitPrice * qty;

      orderItemsData.push({
        variantId: variant.id,
        productNameSnapshot: variant.product.name,
        weightLabelSnapshot: variant.weightLabel,
        unitPriceSnapshot: unitPrice,
        quantity: qty,
        imageUrlSnapshot: variant.product.imageUrl,
      });

      // Trừ tồn kho
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { stock: Math.max(0, variant.stock - qty) },
      });
    }

    // Miễn phí vận chuyển cho đơn từ 500.000đ
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `CK${randomDigits}`;

    const createdOrder = await prisma.order.create({
      data: {
        orderCode,
        customerName: String(customerName).trim(),
        customerPhone: String(customerPhone).trim(),
        shippingAddress: String(shippingAddress).trim(),
        note: note ? String(note).trim() : null,
        paymentMethod: paymentMethod === 'VIETQR' ? 'VIETQR' : 'COD',
        shippingFee,
        totalAmount,
        status: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Không thể tạo đơn hàng, vui lòng thử lại.' });
  }
});

// Tra cứu đơn hàng theo Mã đơn hoặc Số điện thoại
app.get('/api/orders/lookup', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !String(query).trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập mã đơn hàng hoặc số điện thoại' });
    }

    const q = String(query).trim();
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { orderCode: { equals: q.toUpperCase() } },
          { customerPhone: { contains: q } },
        ],
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tra cứu đơn hàng' });
  }
});

// ==========================================
// 2. ADMIN API (TRANG QUẢN TRỊ)
// ==========================================

// Thống kê Dashboard
app.get('/api/admin/stats', async (_req, res) => {
  try {
    const [orders, products, categories, lowStockVariants] = await Promise.all([
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({ include: { variants: true, category: true } }),
      prisma.category.findMany(),
      prisma.productVariant.findMany({
        where: { stock: { lte: 10 } },
        include: { product: true },
        orderBy: { stock: 'asc' },
      }),
    ]);

    const activeOrders = orders.filter((o) => o.status !== 'CANCELLED');
    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;

    const statusBreakdown = {
      PENDING: orders.filter((o) => o.status === 'PENDING').length,
      CONFIRMED: orders.filter((o) => o.status === 'CONFIRMED').length,
      SHIPPING: orders.filter((o) => o.status === 'SHIPPING').length,
      COMPLETED: orders.filter((o) => o.status === 'COMPLETED').length,
      CANCELLED: orders.filter((o) => o.status === 'CANCELLED').length,
    };

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      pendingOrdersCount,
      totalProducts: products.length,
      totalCategories: categories.length,
      lowStockVariants,
      recentOrders: orders.slice(0, 6),
      statusBreakdown,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tải thống kê Admin' });
  }
});

// Quản lý Danh mục: Tạo mới
app.post('/api/admin/categories', async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
    }
    const slug = `${toSlug(name)}-${Date.now().toString().slice(-3)}`;
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
        imageUrl:
          imageUrl ||
          'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tạo danh mục' });
  }
});

// Quản lý Danh mục: Cập nhật
app.put('/api/admin/categories/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, imageUrl } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
      },
    });
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật danh mục' });
  }
});

// Quản lý Danh mục: Xóa
app.delete('/api/admin/categories/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Không thể xóa danh mục này' });
  }
});

// Quản lý Sản phẩm: Tạo mới
app.post('/api/admin/products', async (req, res) => {
  try {
    const {
      categoryId,
      name,
      description,
      origin,
      storageGuide,
      cookingTips,
      imageUrl,
      badge,
      isFeatured,
      isActive,
      variants,
    } = req.body;

    if (!name || !categoryId || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: 'Vui lòng nhập tên cá, danh mục và ít nhất 1 quy cách trọng lượng' });
    }

    const slug = `${toSlug(name)}-${Date.now().toString().slice(-4)}`;

    const created = await prisma.product.create({
      data: {
        categoryId: Number(categoryId),
        name,
        slug,
        description: description || '',
        origin: origin || 'Miền Tây Nam Bộ',
        storageGuide: storageGuide || 'Bảo quản ngăn đông tủ lạnh 6 tháng.',
        cookingTips: cookingTips || 'Chiên vàng hoặc nướng than hoa.',
        imageUrl:
          imageUrl ||
          'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
        badge: badge || null,
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        variants: {
          create: variants.map((v: any) => ({
            weightLabel: String(v.weightLabel || 'Túi 500g'),
            price: Number(v.price) || 150000,
            salePrice: v.salePrice ? Number(v.salePrice) : null,
            stock: Number(v.stock ?? 20),
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm mới' });
  }
});

// Quản lý Sản phẩm: Cập nhật
app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      categoryId,
      name,
      description,
      origin,
      storageGuide,
      cookingTips,
      imageUrl,
      badge,
      isFeatured,
      isActive,
      variants,
    } = req.body;

    // Xóa variants cũ và tạo lại theo danh sách mới để đồng bộ
    await prisma.productVariant.deleteMany({ where: { productId: id } });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        categoryId: Number(categoryId),
        name,
        description,
        origin,
        storageGuide,
        cookingTips,
        imageUrl,
        badge: badge || null,
        isFeatured: Boolean(isFeatured),
        isActive: Boolean(isActive),
        variants: {
          create: (variants || []).map((v: any) => ({
            weightLabel: String(v.weightLabel || 'Túi 500g'),
            price: Number(v.price) || 150000,
            salePrice: v.salePrice ? Number(v.salePrice) : null,
            stock: Number(v.stock ?? 20),
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm' });
  }
});

// Quản lý Sản phẩm: Xóa
app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
  }
});

// Quản lý Đơn hàng: Danh sách
app.get('/api/admin/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = String(status);
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tải danh sách đơn hàng' });
  }
});

// Quản lý Đơn hàng: Cập nhật trạng thái
app.patch('/api/admin/orders/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const updated = await prisma.order.update({
      where: { id },
      data: { status: String(status) },
      include: { items: true },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đơn hàng' });
  }
});

app.listen(PORT, () => {
  console.log(`🐟 Dried Fish Shop Backend đang chạy tại http://localhost:${PORT}`);
});

