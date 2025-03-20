
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingBag, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import MenuCard, { MenuItem } from '@/components/MenuCard';
import OrderSummary from '@/components/OrderSummary';
import MenuItemCustomizer from '@/components/MenuItemCustomizer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Sample order data for tables
const tableOrders: Record<number, MenuItem[]> = {
  2: [
    { id: 'item1', name: 'Margherita Pizza', price: 12.99, description: 'Classic cheese pizza with tomato sauce', image: '/placeholder.svg', category: 'Pizza', quantity: 2 },
    { id: 'item2', name: 'Garlic Bread', price: 4.99, description: 'Toasted bread with garlic butter', image: '/placeholder.svg', category: 'Sides', quantity: 1 },
    { id: 'item3', name: 'Cola', price: 2.49, description: 'Refreshing cola drink', image: '/placeholder.svg', category: 'Beverages', quantity: 1 }
  ],
  5: [
    { id: 'item4', name: 'Chicken Caesar Salad', price: 9.99, description: 'Fresh salad with grilled chicken', image: '/placeholder.svg', category: 'Salads', quantity: 1 },
    { id: 'item5', name: 'French Fries', price: 3.99, description: 'Crispy golden french fries', image: '/placeholder.svg', category: 'Sides', quantity: 2 }
  ],
  7: [
    { id: 'item6', name: 'Cheeseburger', price: 10.99, description: 'Beef patty with cheese', image: '/placeholder.svg', category: 'Burgers', quantity: 1 },
    { id: 'item7', name: 'Iced Tea', price: 2.99, description: 'Sweet iced tea', image: '/placeholder.svg', category: 'Beverages', quantity: 1 }
  ],
  10: [
    { id: 'item8', name: 'Pepperoni Pizza', price: 14.99, description: 'Pizza with pepperoni and cheese', image: '/placeholder.svg', category: 'Pizza', quantity: 1 },
    { id: 'item9', name: 'Buffalo Wings', price: 8.99, description: 'Spicy chicken wings', image: '/placeholder.svg', category: 'Appetizers', quantity: 2 },
    { id: 'item10', name: 'Water', price: 1.49, description: 'Bottled water', image: '/placeholder.svg', category: 'Beverages', quantity: 2 }
  ],
  12: [
    { id: 'item11', name: 'Mushroom Risotto', price: 15.99, description: 'Creamy rice with mushrooms', image: '/placeholder.svg', category: 'Mains', quantity: 2 },
    { id: 'item12', name: 'Bruschetta', price: 6.99, description: 'Toasted bread with tomatoes and basil', image: '/placeholder.svg', category: 'Appetizers', quantity: 1 },
    { id: 'item13', name: 'Tiramisu', price: 7.99, description: 'Italian coffee dessert', image: '/placeholder.svg', category: 'Desserts', quantity: 2 },
    { id: 'item14', name: 'Wine', price: 8.99, description: 'Glass of house wine', image: '/placeholder.svg', category: 'Beverages', quantity: 1 }
  ],
  15: [
    { id: 'item15', name: 'Spaghetti Carbonara', price: 13.99, description: 'Pasta with egg, cheese, and bacon', image: '/placeholder.svg', category: 'Pasta', quantity: 1 },
    { id: 'item16', name: 'Garlic Knots', price: 5.99, description: 'Knotted bread with garlic butter', image: '/placeholder.svg', category: 'Sides', quantity: 1 },
    { id: 'item17', name: 'Cheesecake', price: 6.99, description: 'New York style cheesecake', image: '/placeholder.svg', category: 'Desserts', quantity: 1 },
    { id: 'item18', name: 'Lemonade', price: 2.99, description: 'Fresh squeezed lemonade', image: '/placeholder.svg', category: 'Beverages', quantity: 1 }
  ]
};

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
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuItems] = useState<MenuItem[]>(getInitialMenuItems());
  const [orderItems, setOrderItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [tableId, setTableId] = useState<number | null>(null);

  // Parse URL query parameters for table information
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableIdParam = params.get('tableId');
    const tableNumberParam = params.get('tableNumber');
    
    if (tableIdParam && tableNumberParam) {
      const parsedTableId = parseInt(tableIdParam);
      const parsedTableNumber = parseInt(tableNumberParam);
      
      setTableId(parsedTableId);
      setTableNumber(parsedTableNumber);
      
      // Load order items for this table
      if (tableOrders[parsedTableId]) {
        setOrderItems(tableOrders[parsedTableId]);
        toast.info(`Loaded order for Table ${parsedTableNumber}`);
      }
    }
  }, [location.search]);

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

    // If we're viewing a table's order, update the tableOrders data
    if (tableId !== null) {
      tableOrders[tableId] = [...orderItems, item];
    }

    toast.success(`${item.name} added to order${tableNumber ? ` for Table ${tableNumber}` : ''}`);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    setOrderItems(prevItems => {
      const newItems = prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      // Update table orders if applicable
      if (tableId !== null) {
        tableOrders[tableId] = newItems;
      }
      
      return newItems;
    });
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      
      // Update table orders if applicable
      if (tableId !== null) {
        tableOrders[tableId] = newItems;
      }
      
      return newItems;
    });
  };

  const handleClearOrder = () => {
    setOrderItems([]);
    
    // Update table orders if applicable
    if (tableId !== null) {
      tableOrders[tableId] = [];
    }
  };

  const handleCheckout = () => {
    // Save the current table ID for the checkout page
    navigate('/checkout', { 
      state: { 
        items: orderItems, 
        tableId: tableId,
        tableNumber: tableNumber
      } 
    });
  };

  const handleClearTableFilter = () => {
    // Clear table filter and reset to regular order
    setTableId(null);
    setTableNumber(null);
    setOrderItems([]);
    
    // Update URL to remove query parameters
    navigate('/orders');
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 pt-24 flex">
        {/* Virtual Check (25% width) - Left Side */}
        <div className="w-1/4 pr-4">
          <div className="sticky top-24 h-[calc(100vh-8rem)]">
            {tableNumber && (
              <Alert className="mb-4">
                <ShoppingBag className="h-4 w-4" />
                <AlertTitle>Table {tableNumber} Order</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>You are viewing the order for Table {tableNumber}</span>
                  <Button variant="outline" size="sm" onClick={handleClearTableFilter}>
                    Clear
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            <div className="border rounded-lg p-4 h-full">
              <OrderSummary
                items={orderItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearOrder={handleClearOrder}
                onCheckout={handleCheckout}
                tableNumber={tableNumber}
              />
            </div>
          </div>
        </div>

        {/* Menu Section (75% width) - Right Side */}
        <div className="w-3/4 space-y-6">
          <header>
            <h1 className="text-3xl font-bold">Menu</h1>
            <p className="text-muted-foreground mt-1">
              {tableNumber 
                ? `Add items to Table ${tableNumber}'s order` 
                : 'Browse and add items to your order'}
            </p>
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
                  onAddToOrder={handleAddToOrder}
                />
              ))}
            </div>
          )}
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
