
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Coupon } from '@/data/sampleCoupons';
import { OrderType } from '@/pages/orders/OrderManager';
import { Utensils, ShoppingBag, Send } from 'lucide-react';

interface OrderTotalsProps {
  total: number;
  discount?: number;
  appliedCoupon?: Coupon | null;
  onCheckout: () => void;
  onSendToKitchen?: () => void;
  tableNumber?: number | null;
  orderType?: OrderType;
  isEmpty: boolean;
}

const OrderTotals = ({ 
  total, 
  discount = 0, 
  appliedCoupon = null,
  onCheckout,
  onSendToKitchen,
  tableNumber = null,
  orderType = 'dine-in',
  isEmpty 
}: OrderTotalsProps) => {
  const tax = (total - discount) * 0.07; // 7% tax
  const finalTotal = total - discount + tax;
  const OrderTypeIcon = orderType === 'dine-in' ? Utensils : ShoppingBag;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>{formatCurrency(total)}</span>
      </div>
      
      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount {appliedCoupon && `(${appliedCoupon.code})`}</span>
          <span>-{formatCurrency(discount)}</span>
        </div>
      )}
      
      <div className="flex justify-between text-sm">
        <span>Tax (7%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>
      
      <div className="flex justify-between pt-2 border-t font-medium">
        <span>Total</span>
        <span>{formatCurrency(finalTotal)}</span>
      </div>
      
      {/* Only show the Send to Kitchen button for dine-in orders with a table number */}
      {orderType === 'dine-in' && tableNumber && !isEmpty && onSendToKitchen && (
        <Button 
          onClick={onSendToKitchen}
          variant="outline"
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          Send to Kitchen (KOT)
        </Button>
      )}
      
      <Button 
        onClick={onCheckout} 
        disabled={isEmpty}
        className="w-full"
      >
        <OrderTypeIcon className="h-4 w-4 mr-2" />
        {tableNumber 
          ? `Checkout Table ${tableNumber}` 
          : `Checkout ${orderType === 'dine-in' ? 'Dine-In' : 'To-Go'} Order`
        }
      </Button>
    </div>
  );
};

export default OrderTotals;
