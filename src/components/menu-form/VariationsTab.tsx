
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash } from 'lucide-react';
import { MenuItemVariation } from '@/components/MenuCard';

interface VariationsTabProps {
  variations: MenuItemVariation[];
  newVariation: Partial<MenuItemVariation>;
  handleVariationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddVariation: () => void;
  handleRemoveVariation: (id: string) => void;
}

const VariationsTab = ({
  variations,
  newVariation,
  handleVariationChange,
  handleAddVariation,
  handleRemoveVariation
}: VariationsTabProps) => {
  return (
    <div className="space-y-6 pt-4">
      <div className="border rounded-md p-4 space-y-4">
        <h3 className="font-medium">Add Variation</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="var-name">Variation Name</Label>
            <Input
              id="var-name"
              name="name"
              value={newVariation.name}
              onChange={handleVariationChange}
              placeholder="e.g., Large, Spicy, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="var-price">Price Adjustment ($)</Label>
            <Input
              id="var-price"
              name="priceAdjustment"
              type="number"
              step="0.01"
              value={newVariation.priceAdjustment}
              onChange={handleVariationChange}
              placeholder="2.00"
            />
          </div>
        </div>
        <Button 
          type="button" 
          onClick={handleAddVariation}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Variation
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Current Variations</h3>
        {variations && variations.length > 0 ? (
          <div className="space-y-2">
            {variations.map((variation) => (
              <div 
                key={variation.id} 
                className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
              >
                <div>
                  <p className="font-medium">{variation.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Price adjustment: {variation.priceAdjustment >= 0 ? '+' : ''}
                    ${variation.priceAdjustment.toFixed(2)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveVariation(variation.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">No variations added yet.</p>
        )}
      </div>
    </div>
  );
};

export default VariationsTab;
