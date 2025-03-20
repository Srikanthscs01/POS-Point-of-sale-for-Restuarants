
import { Utensils, ShoppingBag } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { OrderType } from './OrderManager';

interface OrderTypeSelectorProps {
  orderType: OrderType;
  onChange: (type: OrderType) => void;
  disabled?: boolean;
}

const OrderTypeSelector = ({ 
  orderType, 
  onChange, 
  disabled = false 
}: OrderTypeSelectorProps) => {
  return (
    <div className="order-type-selector mb-4">
      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Order Type</h3>
      <ToggleGroup 
        type="single" 
        value={orderType} 
        onValueChange={(value) => {
          if (value) onChange(value as OrderType);
        }}
        disabled={disabled}
        className="w-full justify-start"
      >
        <ToggleGroupItem value="dine-in" className="w-full md:w-40 justify-start data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
          <Utensils className="h-4 w-4 mr-2" />
          Dine-In
        </ToggleGroupItem>
        <ToggleGroupItem value="to-go" className="w-full md:w-40 justify-start data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
          <ShoppingBag className="h-4 w-4 mr-2" />
          To-Go
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default OrderTypeSelector;
