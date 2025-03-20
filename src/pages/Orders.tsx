
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/PageTransition';
import MenuCard, { MenuItem } from '@/components/MenuCard';
import OrderSummary from '@/components/OrderSummary';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

// Sample menu data
const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    price: 8.99,
    category: 'Burgers',
    description: 'Juicy beef patty with melted cheese, lettuce, tomato, and our special sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    price: 12.99,
    category: 'Pizzas',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, basil, and olive oil.',
    image: 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    price: 7.99,
    category: 'Salads',
    description: 'Crisp romaine lettuce with parmesan, croutons, and our house-made dressing.',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '4',
    name: 'Chicken Alfredo',
    price: 14.99,
    category: 'Pasta',
    description: 'Fettuccine pasta with creamy alfredo sauce and grilled chicken breast.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '5',
    name: 'BBQ Ribs',
    price: 17.99,
    category: 'Mains',
    description: 'Slow-cooked pork ribs glazed with our signature BBQ sauce.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '6',
    name: 'Fish & Chips',
    price: 13.99,
    category: 'Mains',
    description: 'Beer-battered cod with crispy fries and tartar sauce.',
    image: 'https://images.unsplash.com/photo-1579208030886-b937da9925dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '7',
    name: 'Chocolate Brownie',
    price: 5.99,
    category: 'Desserts',
    description: 'Warm chocolate brownie with vanilla ice cream and chocolate sauce.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '8',
    name: 'Strawberry Cheesecake',
    price: 6.99,
    category: 'Desserts',
    description: 'Creamy New York style cheesecake with fresh strawberry topping.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '9',
    name: 'Veggie Wrap',
    price: 9.99,
    category: 'Sandwiches',
    description: 'Grilled vegetables, hummus, and mixed greens in a whole wheat wrap.',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '10',
    name: 'French Fries',
    price: 3.99,
    category: 'Sides',
    description: 'Crispy golden fries seasoned with sea salt.',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '11',
    name: 'Onion Rings',
    price: 4.99,
    category: 'Sides',
    description: 'Beer-battered onion rings with spicy dipping sauce.',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '12',
    name: 'Vanilla Milkshake',
    price: 4.99,
    category: 'Drinks',
    description: 'Creamy vanilla milkshake topped with whipped cream.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
];

const Orders = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToOrder = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id);
      
      if (existingItem) {
        return prevCart.map(i => 
          i.id === item.id 
            ? { ...i, quantity: (i.quantity || 1) + 1 } 
            : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast.success(`Added ${item.name} to order`);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    toast.info('Item removed from order');
  };

  const handleClearOrder = () => {
    setCart([]);
    toast.info('Order cleared');
  };

  const handleCheckout = () => {
    // Save order to checkout
    localStorage.setItem('currentOrder', JSON.stringify(cart));
    navigate('/checkout');
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 pt-24">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Place Order</h1>
          <p className="text-muted-foreground mt-1">Create a new order by selecting menu items</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex overflow-x-auto pb-2 no-scrollbar">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-chip whitespace-nowrap ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

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
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <MenuCard
                        id={item.id}
                        name={item.name}
                        price={item.price}
                        description={item.description}
                        image={item.image}
                        category={item.category}
                        onAddToOrder={handleAddToOrder}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <div className="lg:sticky lg:top-24 glass-card p-6 rounded-xl">
              <OrderSummary
                items={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearOrder={handleClearOrder}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Orders;
