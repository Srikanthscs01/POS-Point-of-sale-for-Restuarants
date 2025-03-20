
import OrderSummary from '@/components/OrderSummary';
import TableOrderAlert from './TableOrderAlert';
import { MenuItem } from '@/components/MenuCard';

interface OrderSidePanelProps {
  orderItems: MenuItem[];
  tableNumber: number | null;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
  onCheckout: () => void;
  onClearTableFilter: () => void;
}

const OrderSidePanel = ({
  orderItems,
  tableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  onCheckout,
  onClearTableFilter
}: OrderSidePanelProps) => {
  return (
    <div className="w-1/4 pr-4">
      <div className="sticky top-24 h-[calc(100vh-8rem)]">
        <TableOrderAlert 
          tableNumber={tableNumber}
          onClearTableFilter={onClearTableFilter}
        />
        <div className="border rounded-lg p-4 h-full">
          <OrderSummary
            items={orderItems}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onClearOrder={onClearOrder}
            onCheckout={onCheckout}
            tableNumber={tableNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSidePanel;
