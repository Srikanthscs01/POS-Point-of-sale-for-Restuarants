
import OrderSummary from '@/components/OrderSummary';
import { MenuItem } from '@/components/MenuCard';
import { OrderType } from './OrderManager';

interface OrderSidePanelProps {
  orderItems: MenuItem[];
  tableNumber: number | null;
  tableTime?: string;
  orderType: OrderType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
  onCheckout: () => void;
  onSendToKitchen: () => void;
  onClearTableFilter: () => void;
}

const OrderSidePanel = ({ 
  orderItems, 
  tableNumber,
  tableTime,
  orderType,
  onUpdateQuantity, 
  onRemoveItem, 
  onClearOrder, 
  onCheckout,
  onSendToKitchen,
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
        onSendToKitchen={onSendToKitchen}
        tableNumber={tableNumber}
        tableTime={tableTime}
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
