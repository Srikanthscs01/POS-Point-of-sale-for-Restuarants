
import OrderSummary from '@/components/OrderSummary';
import { MenuItem } from '@/components/MenuCard';
import { OrderType } from './OrderManager';

interface OrderSidePanelProps {
  orderItems: MenuItem[];
  tableNumber: number | null;
  orderType: OrderType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
  onCheckout: () => void;
  onClearTableFilter: () => void;
}

const OrderSidePanel = ({ 
  orderItems, 
  tableNumber,
  orderType,
  onUpdateQuantity, 
  onRemoveItem, 
  onClearOrder, 
  onCheckout,
  onClearTableFilter
}: OrderSidePanelProps) => {
  return (
    <div className="w-1/4 pl-4 border-l">
      <OrderSummary 
        items={orderItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearOrder={onClearOrder}
        onCheckout={onCheckout}
        tableNumber={tableNumber}
        orderType={orderType}
      />
      
      {tableNumber && (
        <div className="mt-4">
          <button 
            className="text-sm text-blue-500 hover:underline" 
            onClick={onClearTableFilter}
          >
            Clear table filter
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSidePanel;
