
import { Search } from 'lucide-react';
import MenuCard, { MenuItem } from '@/components/MenuCard';

interface MenuItemsProps {
  filteredItems: MenuItem[];
  onAddToOrder: (item: MenuItem) => void;
}

const MenuItems = ({ filteredItems, onAddToOrder }: MenuItemsProps) => {
  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No items found</h3>
        <p className="text-muted-foreground mt-1">Try changing your search or filter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
        <MenuCard
          key={item.id}
          id={item.id}
          name={item.name}
          price={item.price}
          description={item.description}
          image={item.image}
          category={item.category}
          variations={item.variations}
          addons={item.addons}
          onAddToOrder={onAddToOrder}
        />
      ))}
    </div>
  );
};

export default MenuItems;
