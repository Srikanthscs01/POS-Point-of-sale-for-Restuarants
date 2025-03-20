
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Search, 
  Filter, 
  X, 
  Plus,
  SlidersHorizontal,
  Save,
  FolderPlus
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import PageTransition from '@/components/PageTransition';
import MenuCard, { MenuItem } from '@/components/MenuCard';
import MenuItemForm from '@/components/MenuItemForm';

// Sample menu data - we'll use this as our initial state
const initialMenuItems: MenuItem[] = [
  // Original menu items
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
    name: 'Chocolate Brownie',
    price: 5.99,
    category: 'Desserts',
    description: 'Warm chocolate brownie with vanilla ice cream and chocolate sauce.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  
  // Indian Breakfast Items - Veg
  {
    id: '5',
    name: 'Masala Dosa',
    price: 6.99,
    category: 'Indian Breakfast (Veg)',
    description: 'Crispy rice crepe filled with spiced potato filling, served with sambar and coconut chutney.',
    image: 'https://images.unsplash.com/photo-1630409351217-5e0f0830942a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '6',
    name: 'Poha',
    price: 4.99,
    category: 'Indian Breakfast (Veg)',
    description: 'Flattened rice flakes cooked with onions, potatoes, and spices, garnished with fresh coriander and lemon.',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '7',
    name: 'Idli Sambhar',
    price: 5.99,
    category: 'Indian Breakfast (Veg)',
    description: 'Steamed rice cakes served with spicy lentil soup and coconut chutney.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  
  // Indian Breakfast Items - Non-Veg
  {
    id: '8',
    name: 'Keema Paratha',
    price: 7.99,
    category: 'Indian Breakfast (Non-Veg)',
    description: 'Flatbread stuffed with spiced minced meat, served with yogurt and pickle.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '9',
    name: 'Egg Bhurji',
    price: 5.99,
    category: 'Indian Breakfast (Non-Veg)',
    description: 'Spiced scrambled eggs with onions, tomatoes, and green chilies, served with buttered toast.',
    image: 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  
  // Indian Lunch Items - Veg
  {
    id: '10',
    name: 'Paneer Butter Masala',
    price: 12.99,
    category: 'Indian Lunch (Veg)',
    description: 'Cottage cheese cubes in a rich, creamy tomato sauce, served with naan or rice.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '11',
    name: 'Dal Makhani',
    price: 9.99,
    category: 'Indian Lunch (Veg)',
    description: 'Black lentils and kidney beans slow-cooked with cream and butter, served with jeera rice.',
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e4c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '12',
    name: 'Vegetable Biryani',
    price: 10.99,
    category: 'Indian Lunch (Veg)',
    description: 'Aromatic rice dish cooked with mixed vegetables and spices, served with raita.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  
  // Indian Lunch Items - Non-Veg
  {
    id: '13',
    name: 'Butter Chicken',
    price: 14.99,
    category: 'Indian Lunch (Non-Veg)',
    description: 'Tender chicken pieces in a rich, creamy tomato-based curry, a crowd favorite.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '14',
    name: 'Lamb Rogan Josh',
    price: 15.99,
    category: 'Indian Lunch (Non-Veg)',
    description: 'Slow-cooked lamb in a rich gravy with aromatic spices from Kashmir.',
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '15',
    name: 'Chicken Biryani',
    price: 13.99,
    category: 'Indian Lunch (Non-Veg)',
    description: 'Fragrant basmati rice cooked with tender chicken pieces and aromatic spices.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  
  // Indian Dinner Items - Veg
  {
    id: '16',
    name: 'Malai Kofta',
    price: 13.99,
    category: 'Indian Dinner (Veg)',
    description: 'Soft potato and paneer dumplings in a creamy, mildly spiced gravy.',
    image: 'https://images.unsplash.com/photo-1590300572834-3c2b6ec334f2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '17',
    name: 'Palak Paneer',
    price: 12.99,
    category: 'Indian Dinner (Veg)',
    description: 'Cottage cheese cubes in a creamy spinach gravy, rich in iron and flavor.',
    image: 'https://images.unsplash.com/photo-1589647363584-f99c6f117e61?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '18',
    name: 'Chana Masala',
    price: 10.99,
    category: 'Indian Dinner (Veg)',
    description: 'Chickpeas cooked in a spicy tomato-based sauce, a North Indian specialty.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356c36?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  
  // Indian Dinner Items - Non-Veg
  {
    id: '19',
    name: 'Fish Curry',
    price: 16.99,
    category: 'Indian Dinner (Non-Veg)',
    description: 'Fresh fish cooked in a tangy coconut milk-based curry, South Indian style.',
    image: 'https://images.unsplash.com/photo-1626860798922-d8fdfcf27bcd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '20',
    name: 'Chicken Tikka Masala',
    price: 15.99,
    category: 'Indian Dinner (Non-Veg)',
    description: 'Grilled chicken pieces in a rich, spicy tomato-based sauce.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '21',
    name: 'Prawn Masala',
    price: 17.99,
    category: 'Indian Dinner (Non-Veg)',
    description: 'Succulent prawns cooked with onions, tomatoes, and a blend of aromatic spices.',
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

const MenuEditor = () => {
  // State management
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  
  // Derived state
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];
  
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Local Storage Management
  useEffect(() => {
    const savedMenuItems = localStorage.getItem('menuItems');
    if (savedMenuItems) {
      try {
        setMenuItems(JSON.parse(savedMenuItems));
      } catch (e) {
        console.error('Failed to parse saved menu items', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  // Handlers
  const handleAddItem = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      setMenuItems(items => items.filter(item => item.id !== selectedItem.id));
      toast.success(`${selectedItem.name} removed from menu`);
    }
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSaveItem = (item: MenuItem) => {
    setMenuItems(items => {
      const itemIndex = items.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        // Update existing item
        const newItems = [...items];
        newItems[itemIndex] = item;
        toast.success(`${item.name} updated`);
        return newItems;
      } else {
        // Add new item
        toast.success(`${item.name} added to menu`);
        return [...items, item];
      }
    });
    setIsFormOpen(false);
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      // We don't need to update the categories array directly as it's derived from menuItems
      toast.success(`Category '${newCategory}' added`);
      setIsCategoryDialogOpen(false);
      setNewCategory('');
    } else if (categories.includes(newCategory)) {
      toast.error(`Category '${newCategory}' already exists`);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 pt-24">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Menu Editor</h1>
          <p className="text-muted-foreground mt-1">Manage your restaurant's menu items</p>
        </header>

        <div className="flex flex-col space-y-6">
          {/* Actions and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex w-full sm:w-auto space-x-2">
              <Button onClick={handleAddItem} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCategoryDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filters */}
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

          <Separator />

          {/* Menu Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-muted-foreground mt-1">Try changing your search or filter</p>
              <Button variant="outline" onClick={handleAddItem} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group relative"
                  >
                    <MenuCard
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      description={item.description}
                      image={item.image}
                      category={item.category}
                      onAddToOrder={() => {}} // Not used in editor
                    />
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={() => handleEditItem(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-destructive/80 backdrop-blur-sm"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Item Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <MenuItemForm
              item={selectedItem || undefined}
              onSave={handleSaveItem}
              onCancel={() => setIsFormOpen(false)}
              categories={categories.filter(c => c !== 'All')}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g., Appetizers, Drinks, Specials"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default MenuEditor;
