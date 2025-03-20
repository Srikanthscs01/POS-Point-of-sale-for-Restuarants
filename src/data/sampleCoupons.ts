
export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // Percentage or fixed amount
  minimumOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
}

export const sampleCoupons: Coupon[] = [
  {
    id: 'COUPON-001',
    code: 'WELCOME15',
    description: '15% off on your first order',
    discountType: 'percentage',
    discountValue: 15,
    minimumOrderAmount: 0,
    expiryDate: '2023-12-31',
    isActive: true
  },
  {
    id: 'COUPON-002',
    code: 'SUMMER10',
    description: '10% off on your order',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrderAmount: 30,
    expiryDate: '2023-08-31',
    isActive: true
  },
  {
    id: 'COUPON-003',
    code: 'FLAT5',
    description: '$5 off on orders above $50',
    discountType: 'fixed',
    discountValue: 5,
    minimumOrderAmount: 50,
    expiryDate: '2023-07-15',
    isActive: true
  },
  {
    id: 'COUPON-004',
    code: 'SPECIAL20',
    description: '20% off on weekends',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrderAmount: 40,
    expiryDate: '2023-09-30',
    isActive: true
  }
];
