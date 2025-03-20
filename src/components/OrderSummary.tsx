import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { MenuItem } from './MenuCard';
import { Coupon } from '@/data/sampleCoupons';
import OrderContent from './order/OrderContent';
import { OrderType } from '@/pages/orders/OrderManager';
import { Utensils, ShoppingBag } from 'lucide-react';

interface OrderSummaryProps {
  items: MenuItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
  onCheckout: () => void;
  tableNumber?: number | null;
  orderType?: OrderType;
  appliedCoupon?: Coupon | null;
  onApplyCoupon?: (coupon: Coupon | null) => void;
}

const OrderSummary = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearOrder, 
  onCheckout,
  tableNumber = null,
  orderType = 'dine-in',
  appliedCoupon = null,
  onApplyCoupon
}: OrderSummaryProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => {
      let itemPrice = item.price;
      
      if (item.selectedVariation) {
        itemPrice += item.selectedVariation.priceAdjustment;
      }
      
      if (item.selectedAddons) {
        itemPrice += item.selectedAddons.reduce((addonSum, addon) => addonSum + addon.price, 0);
      }
      
      return sum + (itemPrice * (item.quantity || 1));
    }, 0);
    
    setTotal(newTotal);

    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        setDiscount(newTotal * (appliedCoupon.discountValue / 100));
      } else {
        setDiscount(appliedCoupon.discountValue);
      }
    } else {
      setDiscount(0);
    }
  }, [items, appliedCoupon]);

  const itemCount = items.reduce((count, item) => count + (item.quantity || 1), 0);

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const calculateItemTotal = (item: MenuItem) => {
    let itemPrice = item.price;
    
    if (item.selectedVariation) {
      itemPrice += item.selectedVariation.priceAdjustment;
    }
    
    if (item.selectedAddons) {
      itemPrice += item.selectedAddons.reduce((addonSum, addon) => addonSum + addon.price, 0);
    }
    
    return itemPrice * (item.quantity || 1);
  };

  const hasCustomizations = (item: MenuItem) => {
    return (item.selectedVariation || (item.selectedAddons && item.selectedAddons.length > 0));
  };

  const OrderTypeIcon = orderType === 'dine-in' ? Utensils : ShoppingBag;

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md p-6">
            <OrderContent
              items={items}
              tableNumber={tableNumber}
              orderType={orderType}
              expandedItems={expandedItems}
              total={total}
              discount={discount}
              appliedCoupon={appliedCoupon}
              toggleItemExpanded={toggleItemExpanded}
              calculateItemTotal={calculateItemTotal}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              onClearOrder={onClearOrder}
              onCheckout={onCheckout}
            />
          </SheetContent>
        </Sheet>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-lg p-4">
          <SheetTrigger asChild>
            <Button 
              className={cn("w-full", items.length === 0 ? "opacity-90" : "")}
              onClick={() => setIsOpen(true)}
            >
              {tableNumber ? (
                `Table ${tableNumber} Order ${itemCount > 0 ? `(${itemCount} ${itemCount === 1 ? 'item' : 'items'})` : ''}`
              ) : (
                <span className="flex items-center">
                  <OrderTypeIcon className="h-4 w-4 mr-2" />
                  {orderType === 'dine-in' ? 'Dine-In' : 'To-Go'} Order 
                  {itemCount > 0 ? ` (${itemCount} ${itemCount === 1 ? 'item' : 'items'})` : ''}
                </span>
              )}
            </Button>
          </SheetTrigger>
        </div>
      </>
    );
  }

  return (
    <div className="h-full">
      <OrderContent
        items={items}
        tableNumber={tableNumber}
        orderType={orderType}
        expandedItems={expandedItems}
        total={total}
        discount={discount}
        appliedCoupon={appliedCoupon}
        toggleItemExpanded={toggleItemExpanded}
        calculateItemTotal={calculateItemTotal}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearOrder={onClearOrder}
        onCheckout={onCheckout}
      />
    </div>
  );
};

export default OrderSummary;
