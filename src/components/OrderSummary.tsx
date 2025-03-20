
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MinusCircle, PlusCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuItem } from './MenuCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface OrderSummaryProps {
  items: MenuItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
  onCheckout: () => void;
}

const OrderSummary = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearOrder, 
  onCheckout 
}: OrderSummaryProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => {
      let itemPrice = item.price;
      
      // Add variation price adjustment
      if (item.selectedVariation) {
        itemPrice += item.selectedVariation.priceAdjustment;
      }
      
      // Add selected addons
      if (item.selectedAddons) {
        itemPrice += item.selectedAddons.reduce((addonSum, addon) => addonSum + addon.price, 0);
      }
      
      return sum + (itemPrice * (item.quantity || 1));
    }, 0);
    
    setTotal(newTotal);
  }, [items]);

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
    
    // Add variation price adjustment
    if (item.selectedVariation) {
      itemPrice += item.selectedVariation.priceAdjustment;
    }
    
    // Add selected addons
    if (item.selectedAddons) {
      itemPrice += item.selectedAddons.reduce((addonSum, addon) => addonSum + addon.price, 0);
    }
    
    return itemPrice * (item.quantity || 1);
  };

  const hasCustomizations = (item: MenuItem) => {
    return (item.selectedVariation || (item.selectedAddons && item.selectedAddons.length > 0));
  };

  const OrderContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Current Order</h2>
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

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-muted-foreground">Your order is empty</p>
          <p className="text-sm text-muted-foreground mt-1">Add items from the menu to get started</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto -mx-4 px-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Collapsible 
                    open={expandedItems.has(item.id)} 
                    onOpenChange={() => hasCustomizations(item) && toggleItemExpanded(item.id)}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1">
                            <h3 className="font-medium">{item.name}</h3>
                            {hasCustomizations(item) && (
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                  {expandedItems.has(item.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {!hasCustomizations(item) && (
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        )}

                        <div className="flex justify-between items-center mt-auto">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                              disabled={(item.quantity || 1) <= 1}
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                            
                            <span className="text-sm font-medium w-4 text-center">
                              {item.quantity || 1}
                            </span>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="font-medium">
                            ${calculateItemTotal(item).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {hasCustomizations(item) && (
                      <CollapsibleContent className="border-t px-3 py-2 bg-muted/30 text-sm">
                        {item.selectedVariation && (
                          <div className="flex justify-between items-center">
                            <span>• {item.selectedVariation.name}</span>
                            <span>
                              {item.selectedVariation.priceAdjustment >= 0 ? '+' : ''}
                              ${item.selectedVariation.priceAdjustment.toFixed(2)}
                            </span>
                          </div>
                        )}
                        
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <div className="space-y-1 mt-1">
                            {item.selectedAddons.map(addon => (
                              <div key={addon.id} className="flex justify-between items-center">
                                <span>• {addon.name}</span>
                                <span>+${addon.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (7%)</span>
                <span>${(total * 0.07).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${(total * 1.07).toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={onCheckout}
              disabled={items.length === 0}
            >
              Checkout (${(total * 1.07).toFixed(2)})
            </Button>
          </div>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md p-6">
            <OrderContent />
          </SheetContent>
        </Sheet>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-lg p-4">
          <SheetTrigger asChild>
            <Button 
              className={cn("w-full", items.length === 0 ? "opacity-90" : "")}
              onClick={() => setIsOpen(true)}
            >
              View Order {itemCount > 0 && `(${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}
            </Button>
          </SheetTrigger>
        </div>
      </>
    );
  }

  return (
    <div className="h-full">
      <OrderContent />
    </div>
  );
};

export default OrderSummary;
