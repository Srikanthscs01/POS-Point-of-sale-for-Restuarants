
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash } from 'lucide-react';
import { MenuItemAddon } from '@/components/MenuCard';

interface AddonsTabProps {
  addons: MenuItemAddon[];
  newAddon: Partial<MenuItemAddon>;
  handleAddonChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddAddon: () => void;
  handleRemoveAddon: (id: string) => void;
}

const AddonsTab = ({
  addons,
  newAddon,
  handleAddonChange,
  handleAddAddon,
  handleRemoveAddon
}: AddonsTabProps) => {
  return (
    <div className="space-y-6 pt-4">
      <div className="border rounded-md p-4 space-y-4">
        <h3 className="font-medium">Add Add-on</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="addon-name">Add-on Name</Label>
            <Input
              id="addon-name"
              name="name"
              value={newAddon.name}
              onChange={handleAddonChange}
              placeholder="e.g., Extra cheese, Bacon, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addon-price">Price ($)</Label>
            <Input
              id="addon-price"
              name="price"
              type="number"
              step="0.01"
              value={newAddon.price}
              onChange={handleAddonChange}
              placeholder="1.00"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="addon-category">Category (optional)</Label>
          <Input
            id="addon-category"
            name="category"
            value={newAddon.category}
            onChange={handleAddonChange}
            placeholder="e.g., Toppings, Sides, etc."
          />
        </div>
        <Button 
          type="button" 
          onClick={handleAddAddon}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Add-on
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Current Add-ons</h3>
        {addons && addons.length > 0 ? (
          <div className="space-y-2">
            {addons.map((addon) => (
              <div 
                key={addon.id} 
                className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
              >
                <div>
                  <p className="font-medium">{addon.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${addon.price.toFixed(2)} 
                    {addon.category && ` • ${addon.category}`}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveAddon(addon.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">No add-ons added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddonsTab;
