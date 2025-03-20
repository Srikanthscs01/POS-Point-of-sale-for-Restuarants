
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { MenuItem, MenuItemVariation, MenuItemAddon } from '@/components/MenuCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface MenuItemCustomizerProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (item: MenuItem) => void;
}

const MenuItemCustomizer = ({ item, isOpen, onClose, onAddToOrder }: MenuItemCustomizerProps) => {
  const [selectedVariation, setSelectedVariation] = useState<MenuItemVariation | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  // Group addons by category
  const addonCategories = item.addons?.reduce(
    (acc, addon) => {
      const category = addon.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(addon);
      return acc;
    },
    {} as Record<string, MenuItemAddon[]>
  ) || {};

  const calculateTotal = () => {
    let total = item.price;
    
    // Add variation price adjustment
    if (selectedVariation) {
      total += selectedVariation.priceAdjustment;
    }
    
    // Add selected add-ons
    selectedAddons.forEach(addon => {
      total += addon.price;
    });
    
    // Multiply by quantity
    total *= quantity;
    
    return total;
  };

  const handleVariationChange = (variationId: string) => {
    const variation = item.variations?.find(v => v.id === variationId) || null;
    setSelectedVariation(variation);
  };

  const handleAddonChange = (addonId: string, isChecked: boolean) => {
    if (isChecked) {
      const addon = item.addons?.find(a => a.id === addonId);
      if (addon) {
        setSelectedAddons(prev => [...prev, addon]);
      }
    } else {
      setSelectedAddons(prev => prev.filter(a => a.id !== addonId));
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const handleAddToOrder = () => {
    const customizedItem: MenuItem = {
      ...item,
      selectedVariation: selectedVariation || undefined,
      selectedAddons: selectedAddons.length > 0 ? selectedAddons : undefined,
      quantity,
    };
    
    onAddToOrder(customizedItem);
    toast.success(`${item.name} added to order`, {
      description: 'Check your order summary for details'
    });
    
    // Reset and close
    setSelectedVariation(null);
    setSelectedAddons([]);
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize {item.name}</DialogTitle>
          <DialogDescription>
            Personalize your order with variations and add-ons
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Item Image */}
            <div className="rounded-md overflow-hidden aspect-video">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Base Price Info */}
            <div>
              <h3 className="font-medium text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <p className="font-medium mt-1">Base price: ${item.price.toFixed(2)}</p>
            </div>
            
            {/* Variations */}
            {item.variations && item.variations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Choose a Variation</h4>
                <RadioGroup
                  value={selectedVariation?.id || ""}
                  onValueChange={handleVariationChange}
                >
                  {item.variations.map((variation) => (
                    <div key={variation.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={variation.id} id={variation.id} />
                      <Label htmlFor={variation.id} className="flex flex-1 justify-between">
                        <span>{variation.name}</span>
                        <span className="text-muted-foreground">
                          {variation.priceAdjustment >= 0 ? '+' : ''}
                          ${variation.priceAdjustment.toFixed(2)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            
            {/* Add-ons */}
            {item.addons && item.addons.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Add-ons</h4>
                {Object.entries(addonCategories).map(([category, addons]) => (
                  <div key={category} className="space-y-2">
                    <h5 className="text-sm font-medium text-muted-foreground">{category}</h5>
                    {addons.map((addon) => (
                      <div key={addon.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={addon.id} 
                          checked={selectedAddons.some(a => a.id === addon.id)}
                          onCheckedChange={(checked) => 
                            handleAddonChange(addon.id, checked === true)
                          }
                        />
                        <Label htmlFor={addon.id} className="flex flex-1 justify-between">
                          <span>{addon.name}</span>
                          <span className="text-muted-foreground">+${addon.price.toFixed(2)}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            
            {/* Quantity */}
            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        {/* Total and Add to Order */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center font-medium">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAddToOrder}>
              Add to Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemCustomizer;
