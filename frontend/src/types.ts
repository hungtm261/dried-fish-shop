export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  _count?: {
    products: number;
  };
}

export interface ProductVariant {
  id: number;
  productId: number;
  weightLabel: string;
  price: number;
  salePrice: number | null;
  stock: number;
}

export interface Product {
  id: number;
  categoryId: number;
  category?: Category;
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
  variants: ProductVariant[];
}

export interface CartItem {
  variantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  imageUrl: string;
  weightLabel: string;
  unitPrice: number;
  originalPrice: number;
  quantity: number;
  stock: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  variantId: number | null;
  productNameSnapshot: string;
  weightLabelSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  imageUrlSnapshot?: string | null;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  note: string | null;
  paymentMethod: 'COD' | 'VIETQR';
  status: OrderStatus;
  shippingFee: number;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrdersCount: number;
  totalProducts: number;
  totalCategories: number;
  lowStockVariants: (ProductVariant & { product: Product })[];
  recentOrders: Order[];
  statusBreakdown: Record<OrderStatus, number>;
}

