
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImagePreview from './ImagePreview';
import { MenuItem } from '@/components/MenuCard';

interface BasicInfoTabProps {
  formData: Partial<MenuItem>;
  errors: { [key: string]: string };
  categories: string[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string;
  setImagePreview: (url: string) => void;
  setErrors: (errors: { [key: string]: string }) => void;
}

const BasicInfoTab = ({ 
  formData, 
  errors, 
  categories, 
  handleChange, 
  handleImageChange,
  imagePreview,
  setImagePreview,
  setErrors
}: BasicInfoTabProps) => {
  
  const handleImageError = () => {
    setImagePreview('');
    setErrors((prev) => ({
      ...prev,
      image: 'Invalid image URL',
    }));
  };

  return (
    <div className="space-y-4 pt-4">
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
        
        <ImagePreview 
          imageUrl={imagePreview} 
          onImageError={handleImageError} 
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
