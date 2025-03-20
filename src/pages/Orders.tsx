
import { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { MenuItem } from '@/components/MenuCard';
import MenuItemCustomizer from '@/components/MenuItemCustomizer';
import OrderManager from './orders/OrderManager';
import OrderSidePanel from './orders/OrderSidePanel';
import MenuSection from './orders/MenuSection';
import OrderTypeSelector from './orders/OrderTypeSelector';

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
      <div className="container mx-auto px-4 py-8 pt-24 flex flex-col">
        <OrderManager menuItems={menuItems}>
          {({
            orderItems,
            tableNumber,
            orderType,
            setOrderType,
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
              {/* Order Type Selector */}
              <OrderTypeSelector 
                orderType={orderType}
                onChange={setOrderType}
                disabled={tableNumber !== null} // Disable selector if table is selected
              />
              
              <div className="flex">
                {/* Menu Section - Left Side */}
                <MenuSection 
                  menuItems={menuItems}
                  onAddToOrder={handleAddToOrder}
                  tableNumber={tableNumber}
                  orderType={orderType}
                />

                {/* Virtual Check - Right Side */}
                <OrderSidePanel 
                  orderItems={orderItems}
                  tableNumber={tableNumber}
                  orderType={orderType}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onClearOrder={handleClearOrder}
                  onCheckout={handleCheckout}
                  onClearTableFilter={handleClearTableFilter}
                />
              </div>

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
