
import { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { MenuItem } from '@/components/MenuCard';
import MenuItemCustomizer from '@/components/MenuItemCustomizer';
import OrderManager from './orders/OrderManager';
import OrderSidePanel from './orders/OrderSidePanel';
import MenuSection from './orders/MenuSection';

// Get initial menu items from localStorage if available
const getInitialMenuItems = (): MenuItem[] => {
  const savedMenuItems = localStorage.getItem('menuItems');
  if (savedMenuItems) {
    try {
      return JSON.parse(savedMenuItems);
    } catch (e) {
      console.error('Failed to parse saved menu items', e);
      return [];
    }
  }
  return [];
};

const Orders = () => {
  const [menuItems] = useState<MenuItem[]>(getInitialMenuItems());

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 pt-24 flex">
        <OrderManager menuItems={menuItems}>
          {({
            orderItems,
            tableNumber,
            handleAddToOrder,
            handleUpdateQuantity,
            handleRemoveItem,
            handleClearOrder,
            handleCheckout,
            handleClearTableFilter,
            selectedItem,
            isCustomizerOpen,
            handleCloseCustomizer,
            addItemToOrder
          }) => (
            <>
              {/* Menu Section - Left Side (previously right) */}
              <MenuSection 
                menuItems={menuItems}
                onAddToOrder={handleAddToOrder}
                tableNumber={tableNumber}
              />

              {/* Virtual Check - Right Side (previously left) */}
              <OrderSidePanel 
                orderItems={orderItems}
                tableNumber={tableNumber}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearOrder={handleClearOrder}
                onCheckout={handleCheckout}
                onClearTableFilter={handleClearTableFilter}
              />

              {/* Customization Dialog */}
              {selectedItem && (
                <MenuItemCustomizer
                  item={selectedItem}
                  isOpen={isCustomizerOpen}
                  onClose={handleCloseCustomizer}
                  onAddToOrder={addItemToOrder}
                />
              )}
            </>
          )}
        </OrderManager>
      </div>
    </PageTransition>
  );
};

export default Orders;
