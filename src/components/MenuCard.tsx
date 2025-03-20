
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MenuItemVariation {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
  category?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  variations?: MenuItemVariation[];
  addons?: MenuItemAddon[];
  quantity?: number;
  selectedVariation?: MenuItemVariation;
  selectedAddons?: MenuItemAddon[];
}

interface MenuItemProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  variations?: MenuItemVariation[];
  addons?: MenuItemAddon[];
  onAddToOrder: (item: MenuItem) => void;
}

const MenuCard = ({ 
  id, 
  name, 
  price, 
  description, 
  image, 
  category, 
  variations, 
  addons, 
  onAddToOrder 
}: MenuItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasCustomizations = (variations && variations.length > 0) || (addons && addons.length > 0);

  const handleAddToOrder = () => {
    onAddToOrder({
      id,
      name,
      price,
      description,
      image,
      category,
      variations,
      addons,
      quantity: 1
    });
  };

  return (
    <motion.div
      className="glass-card rounded-xl overflow-hidden relative hover-lift"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 text-white">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs py-0.5 px-2 bg-white/20 backdrop-blur-sm rounded-full">
                {category}
              </span>
            </div>
            <div className="text-sm font-bold">
              ${price.toFixed(2)}
            </div>
          </div>
        </div>
        
        {hasCustomizations && (
          <div className="absolute top-2 right-2">
            <span className="text-xs py-0.5 px-2 bg-primary/90 text-primary-foreground backdrop-blur-sm rounded-full">
              Customizable
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base">{name}</h3>
          <motion.button 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-md"
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToOrder}
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
    </motion.div>
  );
};

export default MenuCard;
