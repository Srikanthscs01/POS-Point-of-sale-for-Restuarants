
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Utensils, ShoppingBag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence } from 'framer-motion';
import { MenuItem } from '@/components/MenuCard';
import OrderItem from './OrderItem';
import OrderTotals from './OrderTotals';
import EmptyOrderState from './EmptyOrderState';
import { Coupon } from '@/data/sampleCoupons';
import { OrderType } from '@/pages/orders/OrderManager';

interface OrderContentProps {
  items: MenuItem[];
  tableNumber: number | null | undefined;
  orderType: OrderType | undefined;
  expandedItems: Set<string>;
  total: number;
  discount: number;
  appliedCoupon: Coupon | null | undefined;
  toggleItemExpanded: (itemId: string) => void;
  calculateItemTotal: (item: MenuItem) => number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
  onCheckout: () => void;
}

const OrderContent = ({
  items,
  tableNumber,
  orderType = 'dine-in',
  expandedItems,
  total,
  discount,
  appliedCoupon,
  toggleItemExpanded,
  calculateItemTotal,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  onCheckout
}: OrderContentProps) => {
  const OrderTypeIcon = orderType === 'dine-in' ? Utensils : ShoppingBag;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">
            {tableNumber ? (
              <div className="flex items-center gap-2">
                <span>Table {tableNumber}</span>
                <Badge variant="outline" className="text-xs font-normal">Order</Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <OrderTypeIcon className="h-4 w-4" />
                <span>{orderType === 'dine-in' ? 'Dine-In' : 'To-Go'}</span>
                <Badge variant="outline" className="text-xs font-normal">Order</Badge>
              </div>
            )}
          </h2>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearOrder}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Order content area - made scrollable */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyOrderState />
          </div>
        ) : (
          <ScrollArea className="flex-1 h-[calc(100vh-320px)]">
            <div className="pr-4 pb-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <OrderItem 
                    key={item.id}
                    item={item}
                    expandedItems={expandedItems}
                    toggleItemExpanded={toggleItemExpanded}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                    calculateItemTotal={calculateItemTotal}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Order totals with checkout button - fixed at bottom */}
      <div className="mt-auto pt-4 border-t sticky bottom-0 bg-background">
        <OrderTotals
          total={total}
          discount={discount}
          appliedCoupon={appliedCoupon}
          onCheckout={onCheckout}
          tableNumber={tableNumber}
          orderType={orderType}
          isEmpty={items.length === 0}
        />
      </div>
    </div>
  );
};

export default OrderContent;
