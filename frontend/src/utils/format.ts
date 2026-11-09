export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ORDER_STATUS_LABELS: Record<
  string,
  { label: string; colorClass: string; badgeClass: string }
> = {
  PENDING: {
    label: 'Chờ gọi chốt đơn',
    colorClass: 'text-amber-700',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  CONFIRMED: {
    label: 'Đã xác nhận & Đóng gói',
    colorClass: 'text-blue-700',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  SHIPPING: {
    label: 'Đang giao hàng',
    colorClass: 'text-purple-700',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  COMPLETED: {
    label: 'Giao thành công',
    colorClass: 'text-emerald-700',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  CANCELLED: {
    label: 'Đã hủy',
    colorClass: 'text-rose-700',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
  },
};

