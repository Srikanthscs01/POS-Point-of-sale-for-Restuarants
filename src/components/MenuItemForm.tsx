
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MenuItem, MenuItemVariation, MenuItemAddon } from '@/components/MenuCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import BasicInfoTab from './menu-form/BasicInfoTab';
import VariationsTab from './menu-form/VariationsTab';
import AddonsTab from './menu-form/AddonsTab';

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
          <TabsContent value="basic">
            <BasicInfoTab
              formData={formData}
              errors={errors}
              categories={categories}
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              setErrors={setErrors}
            />
          </TabsContent>

          <TabsContent value="variations">
            <VariationsTab
              variations={formData.variations || []}
              newVariation={newVariation}
              handleVariationChange={handleVariationChange}
              handleAddVariation={handleAddVariation}
              handleRemoveVariation={handleRemoveVariation}
            />
          </TabsContent>

          <TabsContent value="addons">
            <AddonsTab
              addons={formData.addons || []}
              newAddon={newAddon}
              handleAddonChange={handleAddonChange}
              handleAddAddon={handleAddAddon}
              handleRemoveAddon={handleRemoveAddon}
            />
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
