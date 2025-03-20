
import { Ticket } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { MenuItem } from '@/components/MenuCard';

interface OrderSummaryCardProps {
  cart: MenuItem[];
  subtotal: number;
  tax: number;
  total: number;
  tip: number;
  tipPercentage: number;
  discount: number;
  formatCurrency: (amount: number) => string;
}

const OrderSummaryCard = ({
  cart,
  subtotal,
  tax,
  total,
  tip,
  tipPercentage,
  discount,
  formatCurrency
}: OrderSummaryCardProps) => {
  return (
    <Card className="hover-lift overflow-hidden">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Review your order before payment</CardDescription>
      </CardHeader>
      
      <CardContent className="px-0">
        <div className="px-6 pb-4">
          <div className="text-sm text-muted-foreground mb-3">Order items</div>
        </div>
        
        <ScrollArea className="max-h-80 px-6">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between py-3 border-t">
              <div>
                <div className="font-medium">
                  {item.quantity}x {item.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)} each
                </div>
              </div>
              <div className="font-medium">
                ${((item.quantity || 1) * item.price).toFixed(2)}
              </div>
            </div>
          ))}
        </ScrollArea>
        
        <div className="px-6 mt-4 pt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${formatCurrency(subtotal)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center gap-1">
                  <Ticket className="h-3 w-3" />
                  Discount
                </span>
                <span>-${formatCurrency(discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (7%)</span>
              <span>${formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tip ({tipPercentage}%)</span>
              <span>${formatCurrency(tip)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${formatCurrency(total + tip)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
