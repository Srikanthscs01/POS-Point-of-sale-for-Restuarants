
import { Ticket } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Coupon } from '@/data/sampleCoupons';

interface OrderTotalsProps {
  total: number;
  discount: number;
  appliedCoupon: Coupon | null | undefined;
  onCheckout: () => void;
  tableNumber: number | null | undefined;
  isEmpty: boolean;
}

const OrderTotals = ({ 
  total, 
  discount, 
  appliedCoupon, 
  onCheckout, 
  tableNumber, 
  isEmpty 
}: OrderTotalsProps) => {
  // Calculate the final total including tax
  const finalTotal = (total - discount) * 1.07;

  return (
    <div className="mt-4 pt-4 border-t">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        {appliedCoupon && discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Ticket className="h-3 w-3" />
              {appliedCoupon.discountType === 'percentage' 
                ? `Discount (${appliedCoupon.discountValue}%)`
                : 'Discount'}
            </span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (7%)</span>
          <span>${((total - discount) * 0.07).toFixed(2)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>
      
      <Button 
        className="w-full mt-4" 
        size="lg"
        onClick={onCheckout}
        disabled={isEmpty}
      >
        {tableNumber 
          ? `Checkout Table ${tableNumber} ($${finalTotal.toFixed(2)})`
          : `Checkout ($${finalTotal.toFixed(2)})`}
      </Button>
    </div>
  );
};

export default OrderTotals;
