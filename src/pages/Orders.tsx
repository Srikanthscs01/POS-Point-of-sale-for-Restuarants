
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import MenuCard, { MenuItem } from '@/components/MenuCard';
import OrderSummary from '@/components/OrderSummary';
import MenuItemCustomizer from '@/components/MenuItemCustomizer';

// Get initial menu items from localStorage if available
const getInitialMenuItems = (): MenuItem[] => {
  const savedMenuItems = localStorage.getItem('menuItems');
  if (savedMenuItems) {
    try {
      return JSON.parse(savedMenuItems);
    } catch (e) {
      console.error('Failed to parse saved menu items', e);
      return [];
    }
  }
  return [];
};

const Orders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuItems] = useState<MenuItem[]>(getInitialMenuItems());
  const [orderItems, setOrderItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

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

  const handleAddToOrder = (item: MenuItem) => {
    // If item has customizations, show customizer dialog
    if ((item.variations && item.variations.length > 0) || 
        (item.addons && item.addons.length > 0)) {
      setSelectedItem(item);
      setIsCustomizerOpen(true);
    } else {
      // Add directly to order with default options
      addItemToOrder({
        ...item,
        quantity: 1
      });
    }
  };

  const addItemToOrder = (item: MenuItem) => {
    setOrderItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => {
        // Check if the same item with the same customization exists
        const sameBase = i.id === item.id;
        const sameVariation = 
          (!i.selectedVariation && !item.selectedVariation) || 
          (i.selectedVariation?.id === item.selectedVariation?.id);
        
        // Check if selected add-ons are the same
        const sameAddons = 
          (!i.selectedAddons && !item.selectedAddons) ||
          (i.selectedAddons && item.selectedAddons && 
           i.selectedAddons.length === item.selectedAddons.length &&
           i.selectedAddons.every(addon => 
             item.selectedAddons?.some(a => a.id === addon.id)
           ));
        
        return sameBase && sameVariation && sameAddons;
      });

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: (newItems[existingItemIndex].quantity || 1) + (item.quantity || 1)
        };
        return newItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });

    toast.success(`${item.name} added to order`);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleClearOrder = () => {
    setOrderItems([]);
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { items: orderItems } });
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-6">
            <header>
              <h1 className="text-3xl font-bold">Menu</h1>
              <p className="text-muted-foreground mt-1">Browse and add items to your order</p>
            </header>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="w-full sm:w-40">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex overflow-x-auto pb-2 no-scrollbar">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className="mr-2 whitespace-nowrap"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Menu Items */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No items found</h3>
                <p className="text-muted-foreground mt-1">Try changing your search or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    onAddToOrder={handleAddToOrder}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1 sticky top-24 h-[calc(100vh-8rem)]">
            <div className="border rounded-lg p-6 h-full">
              <OrderSummary
                items={orderItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearOrder={handleClearOrder}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>

        {/* Customization Dialog */}
        {selectedItem && (
          <MenuItemCustomizer
            item={selectedItem}
            isOpen={isCustomizerOpen}
            onClose={() => {
              setIsCustomizerOpen(false);
              setSelectedItem(null);
            }}
            onAddToOrder={addItemToOrder}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default Orders;
