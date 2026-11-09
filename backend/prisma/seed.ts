import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang cập nhật dữ liệu thực tế CÁ KHÔ TRANG HÒA - CẦN GIỜ...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. Tạo Danh mục thực tế của Cá Khô Trang Hòa - Cần Giờ
  const catCaDua = await prisma.category.create({
    data: {
      name: 'Khô Cá Dứa Cần Giờ (1-2-3-4 Nắng & Phi Lê)',
      slug: 'kho-ca-dua-can-gio',
      description:
        'Đặc sản Khô Cá Dứa Cần Giờ chính gốc phơi trên giàn lưới tự nhiên. Đủ độ nắng từ 1 nắng dẻo ngọt đến 4 nắng săn chắc và phi lê hút chân không.',
      imageUrl: '/images/products/img-6.jpg',
    },
  });

  const catTamVi = await prisma.category.create({
    data: {
      name: 'Cá Khô Tẩm Vị Đặc Sản',
      slug: 'ca-kho-tam-vi',
      description:
        'Cá dứa cắt khoanh tẩm ớt và gia vị đậm đà, phơi nắng tự nhiên trên giàn lưới, đóng gói hút chân không sạch sẽ.',
      imageUrl: '/images/products/img-3.jpg',
    },
  });

  const catCaBien = await prisma.category.create({
    data: {
      name: 'Khô Cá Sặc • Cá Đù • Cá Đuối',
      slug: 'kho-ca-sac-ca-du-ca-duoi',
      description:
        'Các món khô dân dã đậm vị biển Cần Giờ: Khô cá sặc xẻ phơi khô, Khô cá đù ngọt thịt và Khô cá đuối xẻ miếng tươi ngon.',
      imageUrl: '/images/products/img-8.jpg',
    },
  });

  // 2. Tạo 6 Sản phẩm ưu tiên theo đúng Danh mục & Bảng giá thực tế
  // SP 01: Cá dứa 1-2-3-4 nắng
  const p1 = await prisma.product.create({
    data: {
      categoryId: catCaDua.id,
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
      variants: {
        create: [
          { weightLabel: 'Khô cá dứa 1 nắng (1kg)', price: 240000, salePrice: 240000, stock: 50 },
          { weightLabel: 'Khô cá dứa 2 nắng (1kg)', price: 320000, salePrice: 320000, stock: 40 },
          { weightLabel: 'Khô cá dứa 3 nắng (1kg)', price: 350000, salePrice: 350000, stock: 35 },
          { weightLabel: 'Khô cá dứa 4 nắng (1kg)', price: 420000, salePrice: 420000, stock: 30 },
        ],
      },
    },
  });

  // SP 02: Cá dứa phi lê
  const p2 = await prisma.product.create({
    data: {
      categoryId: catCaDua.id,
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
      variants: {
        create: [
          { weightLabel: 'Phi lê 1 nắng (1kg)', price: 260000, salePrice: 260000, stock: 35 },
          { weightLabel: 'Phi lê 2 nắng (1kg)', price: 340000, salePrice: 340000, stock: 30 },
          { weightLabel: 'Phi lê 3 nắng (1kg)', price: 380000, salePrice: 380000, stock: 25 },
        ],
      },
    },
  });

  // SP 03: Cá khô dứa tẩm vị
  const p3 = await prisma.product.create({
    data: {
      categoryId: catTamVi.id,
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
      variants: {
        create: [
          { weightLabel: 'Tẩm vị 1 nắng (1kg)', price: 260000, salePrice: 260000, stock: 40 },
          { weightLabel: 'Tẩm vị 2 nắng (1kg)', price: 350000, salePrice: 350000, stock: 35 },
          { weightLabel: 'Tẩm vị 3-4 nắng đặc biệt (1kg)', price: 450000, salePrice: 450000, stock: 25 },
        ],
      },
    },
  });

  // SP 04: Khô cá sặc
  const p4 = await prisma.product.create({
    data: {
      categoryId: catCaBien.id,
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
      variants: {
        create: [
          { weightLabel: 'Túi 1kg', price: 260000, salePrice: 260000, stock: 45 },
          { weightLabel: 'Túi 500g', price: 130000, salePrice: 130000, stock: 40 },
        ],
      },
    },
  });

  // SP 05: Khô cá đù
  const p5 = await prisma.product.create({
    data: {
      categoryId: catCaBien.id,
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
      variants: {
        create: [
          { weightLabel: 'Cá đù nhỏ (1kg)', price: 130000, salePrice: 130000, stock: 60 },
          { weightLabel: 'Cá đù lớn (1kg)', price: 150000, salePrice: 150000, stock: 50 },
        ],
      },
    },
  });

  // SP 06: Khô cá đuối
  await prisma.product.create({
    data: {
      categoryId: catCaBien.id,
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
      variants: {
        create: [
          { weightLabel: 'Túi 1kg', price: 180000, salePrice: 180000, stock: 40 },
          { weightLabel: 'Túi 500g', price: 90000, salePrice: 90000, stock: 35 },
        ],
      },
    },
  });

  // 3. Tạo Đơn hàng mẫu thực tế của Cá Khô Trang Hòa
  const v1 = await prisma.productVariant.findMany({ where: { productId: p1.id } });
  const v3 = await prisma.productVariant.findMany({ where: { productId: p3.id } });
  const v4 = await prisma.productVariant.findMany({ where: { productId: p4.id } });
  const v5 = await prisma.productVariant.findMany({ where: { productId: p5.id } });

  await prisma.order.create({
    data: {
      orderCode: 'TH1001',
      customerName: 'Anh Minh Quân',
      customerPhone: '0908123456',
      shippingAddress: '128 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
      note: 'Hút chân không kỹ giúp anh để gửi biếu người thân.',
      paymentMethod: 'VIETQR',
      status: 'COMPLETED',
      shippingFee: 0,
      totalAmount: 580000,
      items: {
        create: [
          {
            variantId: v1[1].id,
            productNameSnapshot: p1.name,
            weightLabelSnapshot: v1[1].weightLabel,
            unitPriceSnapshot: 320000,
            quantity: 1,
            imageUrlSnapshot: p1.imageUrl,
          },
          {
            variantId: v4[0].id,
            productNameSnapshot: p4.name,
            weightLabelSnapshot: v4[0].weightLabel,
            unitPriceSnapshot: 260000,
            quantity: 1,
            imageUrlSnapshot: p4.imageUrl,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderCode: 'TH1002',
      customerName: 'Chị Ngọc Lan',
      customerPhone: '0919888777',
      shippingAddress: '45 Lê Văn Lương, Quận 7, TP.HCM',
      note: 'Giao buổi chiều sau 14h.',
      paymentMethod: 'COD',
      status: 'PENDING',
      shippingFee: 0,
      totalAmount: 500000,
      items: {
        create: [
          {
            variantId: v3[1].id,
            productNameSnapshot: p3.name,
            weightLabelSnapshot: v3[1].weightLabel,
            unitPriceSnapshot: 350000,
            quantity: 1,
            imageUrlSnapshot: p3.imageUrl,
          },
          {
            variantId: v5[1].id,
            productNameSnapshot: p5.name,
            weightLabelSnapshot: v5[1].weightLabel,
            unitPriceSnapshot: 150000,
            quantity: 1,
            imageUrlSnapshot: p5.imageUrl,
          },
        ],
      },
    },
  });

  console.log('✅ Đã cập nhật toàn bộ danh mục và bảng giá Cá Khô Trang Hòa - Cần Giờ!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
