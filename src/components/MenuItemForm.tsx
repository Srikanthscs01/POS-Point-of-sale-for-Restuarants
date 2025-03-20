
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MenuItem, MenuItemVariation, MenuItemAddon } from '@/components/MenuCard';
import { X, Plus, Trash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MenuItemFormProps {
  item?: MenuItem;
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
  categories: string[];
}

const MenuItemForm = ({ item, onSave, onCancel, categories }: MenuItemFormProps) => {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'> & { id?: string }>({
    name: '',
    price: 0,
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: categories[0] || 'Other',
    variations: [],
    addons: [],
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState('basic');
  
  // New states for variation and addon creation
  const [newVariation, setNewVariation] = useState<Partial<MenuItemVariation>>({ 
    name: '', 
    priceAdjustment: 0 
  });
  
  const [newAddon, setNewAddon] = useState<Partial<MenuItemAddon>>({ 
    name: '', 
    price: 0,
    category: 'General'
  });

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        category: item.category,
        variations: item.variations || [],
        addons: item.addons || [],
      });
      setImagePreview(item.image);
    }
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      const priceValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(priceValue) ? 0 : priceValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'priceAdjustment') {
      const priceValue = parseFloat(value);
      setNewVariation((prev) => ({
        ...prev,
        [name]: isNaN(priceValue) ? 0 : priceValue,
      }));
    } else {
      setNewVariation((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      const priceValue = parseFloat(value);
      setNewAddon((prev) => ({
        ...prev,
        [name]: isNaN(priceValue) ? 0 : priceValue,
      }));
    } else {
      setNewAddon((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddVariation = () => {
    if (!newVariation.name) {
      toast.error('Variation name is required');
      return;
    }
    
    const variation: MenuItemVariation = {
      id: `var-${Date.now()}`,
      name: newVariation.name || '',
      priceAdjustment: newVariation.priceAdjustment || 0,
    };
    
    setFormData(prev => ({
      ...prev,
      variations: [...(prev.variations || []), variation],
    }));
    
    setNewVariation({ name: '', priceAdjustment: 0 });
    toast.success('Variation added');
  };

  const handleAddAddon = () => {
    if (!newAddon.name) {
      toast.error('Add-on name is required');
      return;
    }
    
    const addon: MenuItemAddon = {
      id: `addon-${Date.now()}`,
      name: newAddon.name || '',
      price: newAddon.price || 0,
      category: newAddon.category,
    };
    
    setFormData(prev => ({
      ...prev,
      addons: [...(prev.addons || []), addon],
    }));
    
    setNewAddon({ name: '', price: 0, category: 'General' });
    toast.success('Add-on added');
  };

  const handleRemoveVariation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      variations: (prev.variations || []).filter(v => v.id !== id),
    }));
  };

  const handleRemoveAddon = (id: string) => {
    setFormData(prev => ({
      ...prev,
      addons: (prev.addons || []).filter(a => a.id !== id),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      image: value,
    }));
    setImagePreview(value);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    const itemToSave: MenuItem = {
      id: formData.id || `item-${Date.now()}`,
      name: formData.name,
      price: formData.price,
      description: formData.description,
      image: formData.image,
      category: formData.category,
      variations: formData.variations,
      addons: formData.addons,
    };
    
    onSave(itemToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="variations">Variations</TabsTrigger>
          <TabsTrigger value="addons">Add-ons</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[60vh] pr-4">
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Base Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
                className={errors.image ? 'border-red-500' : ''}
              />
              {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
              
              {imagePreview && (
                <div className="relative mt-2 rounded-md overflow-hidden aspect-video bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImagePreview('');
                      setErrors((prev) => ({
                        ...prev,
                        image: 'Invalid image URL',
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="variations" className="space-y-6 pt-4">
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
              {formData.variations && formData.variations.length > 0 ? (
                <div className="space-y-2">
                  {formData.variations.map((variation) => (
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
          </TabsContent>

          <TabsContent value="addons" className="space-y-6 pt-4">
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
              {formData.addons && formData.addons.length > 0 ? (
                <div className="space-y-2">
                  {formData.addons.map((addon) => (
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
          </TabsContent>
        </ScrollArea>
      </Tabs>
      
      <div className="flex space-x-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {item ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemForm;
