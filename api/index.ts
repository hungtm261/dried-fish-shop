// Vercel Serverless Function Entry Point (/api/*)
// Hỗ trợ chạy ngay lập tức trên Vercel (In-Memory Data Store khởi tạo sẵn dữ liệu Cá Khô Trang Hòa - Cần Giờ)

interface Variant {
  id: number;
  productId: number;
  weightLabel: string;
  price: number;
  salePrice: number | null;
  stock: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  origin: string;
  storageGuide: string;
  cookingTips: string;
  imageUrl: string;
  badge: string | null;
  isFeatured: boolean;
  isActive: boolean;
  variants: Variant[];
}

interface OrderItem {
  id: number;
  orderId: number;
  variantId: number | null;
  productNameSnapshot: string;
  weightLabelSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  imageUrlSnapshot?: string | null;
}

interface Order {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  note: string | null;
  paymentMethod: 'COD' | 'VIETQR';
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  shippingFee: number;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

// Khởi tạo Store toàn cục cho Serverless Warm Instance
const globalStore = globalThis as any;

if (!globalStore.__TRANG_HOA_STORE__) {
  const categories: Category[] = [
    {
      id: 1,
      name: 'Khô Cá Dứa Cần Giờ (1-2-3-4 Nắng & Phi Lê)',
      slug: 'kho-ca-dua-can-gio',
      description:
        'Đặc sản Khô Cá Dứa Cần Giờ chính gốc phơi trên giàn lưới tự nhiên. Đủ độ nắng từ 1 nắng dẻo ngọt đến 4 nắng săn chắc và phi lê hút chân không.',
      imageUrl: '/images/products/img-6.jpg',
    },
    {
      id: 2,
      name: 'Cá Khô Tẩm Vị Đặc Sản',
      slug: 'ca-kho-tam-vi',
      description:
        'Cá dứa cắt khoanh tẩm ớt và gia vị đậm đà, phơi nắng tự nhiên trên giàn lưới, đóng gói hút chân không sạch sẽ.',
      imageUrl: '/images/products/img-3.jpg',
    },
    {
      id: 3,
      name: 'Khô Cá Sặc • Cá Đù • Cá Đuối',
      slug: 'kho-ca-sac-ca-du-ca-duoi',
      description:
        'Các món khô dân dã đậm vị biển Cần Giờ: Khô cá sặc xẻ phơi khô, Khô cá đù ngọt thịt và Khô cá đuối xẻ miếng tươi ngon.',
      imageUrl: '/images/products/img-8.jpg',
    },
  ];

  const products: Product[] = [
    {
      id: 1,
      categoryId: 1,
      name: 'Khô Cá Dứa Cần Giờ (Chọn Theo Độ Nắng: 1 - 2 - 3 - 4 Nắng)',
      slug: 'kho-ca-dua-can-gio-1-2-3-4-nang',
      description:
        'Cá dứa Cần Giờ thịt dày, ngọt tự nhiên, xẻ phơi trực tiếp trên giàn lưới dưới nắng biển Cần Giờ. Khách có thể chọn độ nắng theo sở thích (1 nắng mềm dẻo hoặc 2-3-4 nắng ráo thịt, tiện gửi đi xa).',
      origin: 'Cần Giờ - TP.HCM',
      storageGuide:
        'Cắt nhỏ để vào hộp nhựa có nắp đậy, để vào ngăn đá tủ lạnh hoặc tủ đông. Lấy ra 15 phút (không rửa nước) trước khi sử dụng.',
      cookingTips: 'Chiên vàng giòn ăn cùng cơm trắng, cơm cháy hoặc nướng lửa than.',
      imageUrl: '/images/products/img-6.jpg',
      badge: '01 • Phơi Nắng Tự Nhiên',
      isFeatured: true,
      isActive: true,
      variants: [
        { id: 101, productId: 1, weightLabel: 'Khô cá dứa 1 nắng (1kg)', price: 240000, salePrice: 240000, stock: 50 },
        { id: 102, productId: 1, weightLabel: 'Khô cá dứa 2 nắng (1kg)', price: 320000, salePrice: 320000, stock: 40 },
        { id: 103, productId: 1, weightLabel: 'Khô cá dứa 3 nắng (1kg)', price: 350000, salePrice: 350000, stock: 35 },
        { id: 104, productId: 1, weightLabel: 'Khô cá dứa 4 nắng (1kg)', price: 420000, salePrice: 420000, stock: 30 },
      ],
    },
    {
      id: 2,
      categoryId: 1,
      name: 'Cá Dứa Phi Lê Cắt Miếng & Sợi (Đóng Gói Hút Chân Không)',
      slug: 'ca-dua-phi-le-hut-chan-khong',
      description:
        'Cá dứa Cần Giờ đã lọc sạch xương, phi lê cắt miếng hoặc cắt dải vừa ăn và đóng gói hút chân không kỹ lưỡng kèm nhãn hướng dẫn bảo quản. Rất tiện lợi khi chế biến hoặc mang đi biếu tặng, gửi đi xa.',
      origin: 'Cần Giờ - TP.HCM',
      storageGuide:
        'Bảo quản ngăn đá tủ lạnh hoặc tủ đông. Rã đông tự nhiên 15 phút trước khi chiên hoặc nướng (không rửa lại bằng nước).',
      cookingTips: 'Chiên giòn không lo xương, làm cơm cháy khô cá dứa, trộn gỏi xoài hoặc rim mặn ngọt.',
      imageUrl: '/images/products/img-4.jpg',
      badge: '02 • Hút Chân Không Sẵn',
      isFeatured: true,
      isActive: true,
      variants: [
        { id: 201, productId: 2, weightLabel: 'Phi lê 1 nắng (1kg)', price: 260000, salePrice: 260000, stock: 35 },
        { id: 202, productId: 2, weightLabel: 'Phi lê 2 nắng (1kg)', price: 340000, salePrice: 340000, stock: 30 },
        { id: 203, productId: 2, weightLabel: 'Phi lê 3 nắng (1kg)', price: 380000, salePrice: 380000, stock: 25 },
      ],
    },
    {
      id: 3,
      categoryId: 2,
      name: 'Khô Cá Dứa Tẩm Vị (Cắt Khoanh, Tẩm Ớt, Phơi Nắng)',
      slug: 'kho-ca-dua-tam-vi-cat-khoanh',
      description:
        'Cá dứa tươi cắt khoanh dày đẹp mắt, tẩm ớt và gia vị đậm đà vừa ăn rồi đem phơi nắng trên giàn lưới. Giá từ 260.000đ - 450.000đ/kg tùy theo độ nắng và loại tẩm, đóng gói hút chân không sạch sẽ.',
      origin: 'Cần Giờ - TP.HCM',
      storageGuide: 'Để ngăn đá tủ lạnh hoặc tủ đông. Lấy ra 15 phút trước khi chiên hoặc nướng.',
      cookingTips: 'Chiên lửa nhỏ cho vàng thơm hai mặt khoanh cá, ăn với cơm nóng cực kỳ bắt cơm.',
      imageUrl: '/images/products/img-3.jpg',
      badge: '03 • Vị Mới Bán Chạy',
      isFeatured: true,
      isActive: true,
      variants: [
        { id: 301, productId: 3, weightLabel: 'Tẩm vị 1 nắng (1kg)', price: 260000, salePrice: 260000, stock: 40 },
        { id: 302, productId: 3, weightLabel: 'Tẩm vị 2 nắng (1kg)', price: 350000, salePrice: 350000, stock: 35 },
        { id: 303, productId: 3, weightLabel: 'Tẩm vị 3-4 nắng đặc biệt (1kg)', price: 450000, salePrice: 450000, stock: 25 },
      ],
    },
    {
      id: 4,
      categoryId: 3,
      name: 'Khô Cá Sặc Cần Giờ (Cá Sặc Xẻ, Phơi Khô)',
      slug: 'kho-ca-sac-can-gio',
      description:
        'Cá sặc tuyển chọn con đều, làm sạch, khứa mình và phơi khô tự nhiên trên giàn lưới. Thịt cá chắc, đậm vị, thơm béo tự nhiên, thích hợp làm món nhắm lai rai hoặc chiên dùng trong bữa cơm gia đình.',
      origin: 'Cần Giờ - TP.HCM',
      storageGuide: 'Bảo quản ngăn đông hoặc ngăn mát tủ lạnh, bọc kín sau khi mở túi.',
      cookingTips: 'Nướng than/nồi chiên không dầu hoặc chiên vàng, xé nhỏ trộn gỏi xoài xanh, gỏi dưa leo.',
      imageUrl: '/images/products/img-8.jpg',
      badge: '04 • Thịt Chắc Đậm Vị',
      isFeatured: true,
      isActive: true,
      variants: [
        { id: 401, productId: 4, weightLabel: 'Túi 1kg', price: 260000, salePrice: 260000, stock: 45 },
        { id: 402, productId: 4, weightLabel: 'Túi 500g', price: 130000, salePrice: 130000, stock: 40 },
      ],
    },
    {
      id: 5,
      categoryId: 3,
      name: 'Khô Cá Đù Phơi Nắng Tự Nhiên (Cá Đù Nhỏ & Cá Đù Lớn)',
      slug: 'kho-ca-du-phoi-nang-tu-nhien',
      description:
        'Khô cá đù biển Cần Giờ xẻ phơi nắng tự nhiên, thịt cá ngọt dịu, mềm dẻo và giá rất bình dân cho bữa cơm hàng ngày. Có 2 phân loại kích cỡ: Cá đù nhỏ (130.000đ/kg) và Cá đù lớn (150.000đ/kg).',
      origin: 'Cần Giờ - TP.HCM',
      storageGuide: 'Bảo quản ngăn đá tủ lạnh để giữ độ tươi ngọt lâu dài.',
      cookingTips: 'Chiên vàng giòn hoặc chiên giấm đường, rim tỏi ớt ăn cùng cơm trắng, cháo trắng.',
      imageUrl: '/images/products/img-ca-du.jpg',
      badge: '05 • Ngọt Thịt Bình Dân',
      isFeatured: true,
      isActive: true,
      variants: [
        { id: 501, productId: 5, weightLabel: 'Cá đù nhỏ (1kg)', price: 130000, salePrice: 130000, stock: 60 },
        { id: 502, productId: 5, weightLabel: 'Cá đù lớn (1kg)', price: 150000, salePrice: 150000, stock: 50 },
      ],
    },
    {
      id: 6,
      categoryId: 3,
      name: 'Khô Cá Đuối Cần Giờ (Xẻ Miếng Tươi Ngon)',
      slug: 'kho-ca-duoi-can-gio',
      description:
        'Cá đuối tươi xẻ miếng tạo hình quạt đẹp mắt và phơi nắng tự nhiên. Thịt và sụn cá đuối dai ngọt, thơm đặc trưng, nướng lên chấm mắm me là món nhắm khó cưỡng.',
      origin: 'Cần Giờ - TP.HCM',
      storageGuide: 'Bảo quản ngăn đông tủ lạnh. Rã đông 10-15 phút trước khi nướng hoặc chiên.',
      cookingTips: 'Nướng than hoa hoặc nồi chiên không dầu, đập nhẹ rồi xé sợi chấm mắm me tỏi ớt.',
      imageUrl: '/images/products/img-ca-duoi.jpg',
      badge: '06 • Dai Ngọt Thơm Đặc Trưng',
      isFeatured: true,
      isActive: true,
      variants: [
        { id: 601, productId: 6, weightLabel: 'Túi 1kg', price: 180000, salePrice: 180000, stock: 40 },
        { id: 602, productId: 6, weightLabel: 'Túi 500g', price: 90000, salePrice: 90000, stock: 35 },
      ],
    },
  ];

  const orders: Order[] = [
    {
      id: 1,
      orderCode: 'TH1001',
      customerName: 'Anh Minh Quân',
      customerPhone: '0908123456',
      shippingAddress: '128 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
      note: 'Hút chân không kỹ giúp anh để gửi biếu người thân.',
      paymentMethod: 'VIETQR',
      status: 'COMPLETED',
      shippingFee: 0,
      totalAmount: 580000,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      items: [
        {
          id: 1,
          orderId: 1,
          variantId: 102,
          productNameSnapshot: products[0].name,
          weightLabelSnapshot: 'Khô cá dứa 2 nắng (1kg)',
          unitPriceSnapshot: 320000,
          quantity: 1,
          imageUrlSnapshot: products[0].imageUrl,
        },
        {
          id: 2,
          orderId: 1,
          variantId: 401,
          productNameSnapshot: products[3].name,
          weightLabelSnapshot: 'Túi 1kg',
          unitPriceSnapshot: 260000,
          quantity: 1,
          imageUrlSnapshot: products[3].imageUrl,
        },
      ],
    },
    {
      id: 2,
      orderCode: 'TH1002',
      customerName: 'Chị Ngọc Lan',
      customerPhone: '0919888777',
      shippingAddress: '45 Lê Văn Lương, Quận 7, TP.HCM',
      note: 'Giao buổi chiều sau 14h.',
      paymentMethod: 'COD',
      status: 'PENDING',
      shippingFee: 0,
      totalAmount: 500000,
      createdAt: new Date().toISOString(),
      items: [
        {
          id: 3,
          orderId: 2,
          variantId: 302,
          productNameSnapshot: products[2].name,
          weightLabelSnapshot: 'Tẩm vị 2 nắng (1kg)',
          unitPriceSnapshot: 350000,
          quantity: 1,
          imageUrlSnapshot: products[2].imageUrl,
        },
        {
          id: 4,
          orderId: 2,
          variantId: 502,
          productNameSnapshot: products[4].name,
          weightLabelSnapshot: 'Cá đù lớn (1kg)',
          unitPriceSnapshot: 150000,
          quantity: 1,
          imageUrlSnapshot: products[4].imageUrl,
        },
      ],
    },
  ];

  globalStore.__TRANG_HOA_STORE__ = { categories, products, orders };
}

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

export default function handler(req: any, res: any) {
  const store = globalStore.__TRANG_HOA_STORE__ as {
    categories: Category[];
    products: Product[];
    orders: Order[];
  };

  const urlObj = new URL(req.url || '/api', `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const method = req.method || 'GET';

  // Helper enrich product with category
  const enrichProduct = (p: Product) => ({
    ...p,
    category: store.categories.find((c) => c.id === p.categoryId),
  });

  // 1. GET /api/categories
  if (pathname === '/api/categories' && method === 'GET') {
    const result = store.categories.map((c) => ({
      ...c,
      _count: {
        products: store.products.filter((p) => p.categoryId === c.id).length,
      },
    }));
    return res.status(200).json(result);
  }

  // 2. GET /api/products
  if (pathname === '/api/products' && method === 'GET') {
    const category = urlObj.searchParams.get('category');
    const search = urlObj.searchParams.get('search');
    const featured = urlObj.searchParams.get('featured');
    const origin = urlObj.searchParams.get('origin');
    const includeInactive = urlObj.searchParams.get('includeInactive');

    let list = store.products.map(enrichProduct);

    if (includeInactive !== 'true') {
      list = list.filter((p) => p.isActive);
    }
    if (category && category !== 'all') {
      list = list.filter((p) => p.category?.slug === category);
    }
    if (featured === 'true') {
      list = list.filter((p) => p.isFeatured);
    }
    if (origin && origin !== 'all') {
      list = list.filter((p) => p.origin.includes(origin));
    }
    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q)
      );
    }

    return res.status(200).json(list);
  }

  // 3. GET /api/products/:slug
  if (pathname.startsWith('/api/products/') && method === 'GET') {
    const slug = pathname.replace('/api/products/', '');
    const found = store.products.find((p) => p.slug === slug);
    if (!found) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    const product = enrichProduct(found);
    const relatedProducts = store.products
      .filter((p) => p.id !== found.id && p.isActive)
      .slice(0, 4)
      .map(enrichProduct);

    return res.status(200).json({ product, relatedProducts });
  }

  // 4. POST /api/orders
  if (pathname === '/api/orders' && method === 'POST') {
    const { customerName, customerPhone, shippingAddress, note, paymentMethod, items } =
      req.body || {};

    if (!customerName || !customerPhone || !shippingAddress || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin nhận hàng.' });
    }

    let subtotal = 0;
    const orderItems: OrderItem[] = [];
    const newOrderId = store.orders.length + 1;

    for (const item of items) {
      let foundVariant: Variant | undefined;
      let foundProduct: Product | undefined;

      for (const p of store.products) {
        const v = p.variants.find((va) => va.id === Number(item.variantId));
        if (v) {
          foundVariant = v;
          foundProduct = p;
          break;
        }
      }

      if (!foundVariant || !foundProduct) continue;

      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = foundVariant.salePrice ?? foundVariant.price;
      subtotal += unitPrice * qty;
      foundVariant.stock = Math.max(0, foundVariant.stock - qty);

      orderItems.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        orderId: newOrderId,
        variantId: foundVariant.id,
        productNameSnapshot: foundProduct.name,
        weightLabelSnapshot: foundVariant.weightLabel,
        unitPriceSnapshot: unitPrice,
        quantity: qty,
        imageUrlSnapshot: foundProduct.imageUrl,
      });
    }

    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;
    const orderCode = `TH${Math.floor(1000 + Math.random() * 9000)}`;

    const createdOrder: Order = {
      id: newOrderId,
      orderCode,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      shippingAddress: String(shippingAddress).trim(),
      note: note ? String(note).trim() : null,
      paymentMethod: paymentMethod === 'VIETQR' ? 'VIETQR' : 'COD',
      status: 'PENDING',
      shippingFee,
      totalAmount,
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    store.orders.unshift(createdOrder);
    return res.status(201).json(createdOrder);
  }

  // 5. GET /api/orders/lookup
  if (pathname === '/api/orders/lookup' && method === 'GET') {
    const q = (urlObj.searchParams.get('query') || '').trim().toUpperCase();
    if (!q) return res.status(200).json([]);

    const matched = store.orders.filter(
      (o) => o.orderCode.toUpperCase() === q || o.customerPhone.includes(q)
    );
    return res.status(200).json(matched);
  }

  // 6. GET /api/admin/stats
  if (pathname === '/api/admin/stats' && method === 'GET') {
    const activeOrders = store.orders.filter((o) => o.status !== 'CANCELLED');
    const totalRevenue = activeOrders.reduce((s, o) => s + o.totalAmount, 0);
    const pendingOrdersCount = store.orders.filter((o) => o.status === 'PENDING').length;

    const lowStockVariants: any[] = [];
    store.products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.stock <= 10) {
          lowStockVariants.push({ ...v, product: p });
        }
      });
    });

    const statusBreakdown = {
      PENDING: store.orders.filter((o) => o.status === 'PENDING').length,
      CONFIRMED: store.orders.filter((o) => o.status === 'CONFIRMED').length,
      SHIPPING: store.orders.filter((o) => o.status === 'SHIPPING').length,
      COMPLETED: store.orders.filter((o) => o.status === 'COMPLETED').length,
      CANCELLED: store.orders.filter((o) => o.status === 'CANCELLED').length,
    };

    return res.status(200).json({
      totalRevenue,
      totalOrders: store.orders.length,
      pendingOrdersCount,
      totalProducts: store.products.length,
      totalCategories: store.categories.length,
      lowStockVariants,
      recentOrders: store.orders.slice(0, 6),
      statusBreakdown,
    });
  }

  // 7. GET /api/admin/orders
  if (pathname === '/api/admin/orders' && method === 'GET') {
    const status = urlObj.searchParams.get('status');
    const list =
      status && status !== 'ALL'
        ? store.orders.filter((o) => o.status === status)
        : store.orders;
    return res.status(200).json(list);
  }

  // 8. PATCH /api/admin/orders/:id/status
  if (pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/status') && method === 'PATCH') {
    const id = Number(pathname.split('/')[4]);
    const order = store.orders.find((o) => o.id === id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    order.status = req.body?.status || order.status;
    return res.status(200).json(order);
  }

  // 9. Admin Categories CRUD
  if (pathname === '/api/admin/categories' && method === 'POST') {
    const { name, description, imageUrl } = req.body || {};
    const newCat: Category = {
      id: Date.now(),
      name,
      slug: `${toSlug(name)}-${Date.now().toString().slice(-3)}`,
      description: description || '',
      imageUrl: imageUrl || '/images/products/img-6.jpg',
    };
    store.categories.push(newCat);
    return res.status(201).json(newCat);
  }

  if (pathname.startsWith('/api/admin/categories/') && method === 'DELETE') {
    const id = Number(pathname.replace('/api/admin/categories/', ''));
    store.categories = store.categories.filter((c) => c.id !== id);
    return res.status(200).json({ success: true });
  }

  // 10. Admin Products CRUD
  if (pathname === '/api/admin/products' && method === 'POST') {
    const body = req.body || {};
    const newProdId = Date.now();
    const newProd: Product = {
      id: newProdId,
      categoryId: Number(body.categoryId) || 1,
      name: body.name,
      slug: `${toSlug(body.name)}-${Date.now().toString().slice(-3)}`,
      description: body.description || '',
      origin: body.origin || 'Cần Giờ - TP.HCM',
      storageGuide: body.storageGuide || 'Bảo quản ngăn đá tủ lạnh.',
      cookingTips: body.cookingTips || 'Chiên hoặc nướng.',
      imageUrl: body.imageUrl || '/images/products/img-6.jpg',
      badge: body.badge || null,
      isFeatured: Boolean(body.isFeatured),
      isActive: true,
      variants: (body.variants || []).map((v: any, idx: number) => ({
        id: newProdId + idx + 1,
        productId: newProdId,
        weightLabel: v.weightLabel || 'Túi 1kg',
        price: Number(v.price) || 200000,
        salePrice: v.salePrice ? Number(v.salePrice) : null,
        stock: Number(v.stock ?? 30),
      })),
    };
    store.products.push(newProd);
    return res.status(201).json(enrichProduct(newProd));
  }

  if (pathname.startsWith('/api/admin/products/') && method === 'PUT') {
    const id = Number(pathname.replace('/api/admin/products/', ''));
    const body = req.body || {};
    const idx = store.products.findIndex((p) => p.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });

    const existing = store.products[idx];
    const updated: Product = {
      ...existing,
      categoryId: Number(body.categoryId) || existing.categoryId,
      name: body.name ?? existing.name,
      description: body.description ?? existing.description,
      origin: body.origin ?? existing.origin,
      storageGuide: body.storageGuide ?? existing.storageGuide,
      cookingTips: body.cookingTips ?? existing.cookingTips,
      imageUrl: body.imageUrl ?? existing.imageUrl,
      badge: body.badge ?? existing.badge,
      isFeatured: Boolean(body.isFeatured),
      variants: (body.variants || []).map((v: any, i: number) => ({
        id: Date.now() + i,
        productId: id,
        weightLabel: v.weightLabel,
        price: Number(v.price),
        salePrice: v.salePrice ? Number(v.salePrice) : null,
        stock: Number(v.stock ?? 20),
      })),
    };
    store.products[idx] = updated;
    return res.status(200).json(enrichProduct(updated));
  }

  if (pathname.startsWith('/api/admin/products/') && method === 'DELETE') {
    const id = Number(pathname.replace('/api/admin/products/', ''));
    store.products = store.products.filter((p) => p.id !== id);
    return res.status(200).json({ success: true });
  }

  return res.status(404).json({ message: 'API route not found' });
}

