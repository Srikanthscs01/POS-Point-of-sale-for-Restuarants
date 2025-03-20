
import { useState } from 'react';
import { MenuItem } from '@/components/MenuCard';
import OrderFilters from './OrderFilters';
import MenuItems from './MenuItems';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddToOrder: (item: MenuItem) => void;
  tableNumber: number | null;
}

const MenuSection = ({ menuItems, onAddToOrder, tableNumber }: MenuSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Derive categories from menu items
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  // Filter menu items based on active category and search term
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = 
      searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-3/4 pr-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Menu</h1>
        <p className="text-muted-foreground mt-1">
          {tableNumber 
            ? `Add items to Table ${tableNumber}'s order` 
            : 'Browse and add items to your order'}
        </p>
      </header>

      <OrderFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
      />

      <MenuItems 
        filteredItems={filteredItems} 
        onAddToOrder={onAddToOrder} 
      />
    </div>
  );
};

export default MenuSection;
