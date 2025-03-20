
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MinusCircle, PlusCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/components/MenuCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface OrderItemProps {
  item: MenuItem;
  expandedItems: Set<string>;
  toggleItemExpanded: (itemId: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  calculateItemTotal: (item: MenuItem) => number;
}

const OrderItem = ({
  item,
  expandedItems,
  toggleItemExpanded,
  onUpdateQuantity,
  onRemoveItem,
  calculateItemTotal
}: OrderItemProps) => {
  // Helper function to determine if an item has customizations
  const hasCustomizations = (item: MenuItem): boolean => {
    return !!(item.selectedVariation || (item.selectedAddons && item.selectedAddons.length > 0));
  };

  return (
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
  );
};

export default OrderItem;
