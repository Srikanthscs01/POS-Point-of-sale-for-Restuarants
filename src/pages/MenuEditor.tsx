
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
