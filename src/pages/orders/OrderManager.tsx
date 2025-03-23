import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { MenuItem } from '@/components/MenuCard';
import MenuItemCustomizer from '@/components/MenuItemCustomizer';

// Order type definition
export type OrderType = 'dine-in' | 'to-go';

// Sample order data for tables
const tableOrders: Record<number, MenuItem[]> = {
  2: [
    { id: 'item1', name: 'Margherita Pizza', price: 12.99, description: 'Classic cheese pizza with tomato sauce', image: '/placeholder.svg', category: 'Pizza', quantity: 2 },
    { id: 'item2', name: 'Garlic Bread', price: 4.99, description: 'Toasted bread with garlic butter', image: '/placeholder.svg', category: 'Sides', quantity: 1 },
    { id: 'item3', name: 'Cola', price: 2.49, description: 'Refreshing cola drink', image: '/placeholder.svg', category: 'Beverages', quantity: 1 }
  ],
  5: [
    { id: 'item4', name: 'Chicken Caesar Salad', price: 9.99, description: 'Fresh salad with grilled chicken', image: '/placeholder.svg', category: 'Salads', quantity: 1 },
    { id: 'item5', name: 'French Fries', price: 3.99, description: 'Crispy golden french fries', image: '/placeholder.svg', category: 'Sides', quantity: 2 }
  ],
  7: [
    { id: 'item6', name: 'Cheeseburger', price: 10.99, description: 'Beef patty with cheese', image: '/placeholder.svg', category: 'Burgers', quantity: 1 },
    { id: 'item7', name: 'Iced Tea', price: 2.99, description: 'Sweet iced tea', image: '/placeholder.svg', category: 'Beverages', quantity: 1 }
  ],
  10: [
    { id: 'item8', name: 'Pepperoni Pizza', price: 14.99, description: 'Pizza with pepperoni and cheese', image: '/placeholder.svg', category: 'Pizza', quantity: 1 },
    { id: 'item9', name: 'Buffalo Wings', price: 8.99, description: 'Spicy chicken wings', image: '/placeholder.svg', category: 'Appetizers', quantity: 2 },
    { id: 'item10', name: 'Water', price: 1.49, description: 'Bottled water', image: '/placeholder.svg', category: 'Beverages', quantity: 2 }
  ],
  12: [
    { id: 'item11', name: 'Mushroom Risotto', price: 15.99, description: 'Creamy rice with mushrooms', image: '/placeholder.svg', category: 'Mains', quantity: 2 },
    { id: 'item12', name: 'Bruschetta', price: 6.99, description: 'Toasted bread with tomatoes and basil', image: '/placeholder.svg', category: 'Appetizers', quantity: 1 },
    { id: 'item13', name: 'Tiramisu', price: 7.99, description: 'Italian coffee dessert', image: '/placeholder.svg', category: 'Desserts', quantity: 2 },
    { id: 'item14', name: 'Wine', price: 8.99, description: 'Glass of house wine', image: '/placeholder.svg', category: 'Beverages', quantity: 1 }
  ],
  15: [
    { id: 'item15', name: 'Spaghetti Carbonara', price: 13.99, description: 'Pasta with egg, cheese, and bacon', image: '/placeholder.svg', category: 'Pasta', quantity: 1 },
    { id: 'item16', name: 'Garlic Knots', price: 5.99, description: 'Knotted bread with garlic butter', image: '/placeholder.svg', category: 'Sides', quantity: 1 },
    { id: 'item17', name: 'Cheesecake', price: 6.99, description: 'New York style cheesecake', image: '/placeholder.svg', category: 'Desserts', quantity: 1 },
    { id: 'item18', name: 'Lemonade', price: 2.99, description: 'Fresh squeezed lemonade', image: '/placeholder.svg', category: 'Beverages', quantity: 1 }
  ]
};

// Keep track of when tables became active
const tableActiveTimes: Record<number, Date> = {};

interface OrderManagerProps {
  menuItems: MenuItem[];
  children: (props: {
    orderItems: MenuItem[];
    tableNumber: number | null;
    tableTime: string | undefined;
    orderType: OrderType;
    setOrderType: (type: OrderType) => void;
    handleAddToOrder: (item: MenuItem) => void;
    handleUpdateQuantity: (id: string, quantity: number) => void;
    handleRemoveItem: (id: string) => void;
    handleClearOrder: () => void;
    handleCheckout: () => void;
    handleSendToKitchen: () => void;
    handleClearTableFilter: () => void;
    selectedItem: MenuItem | null;
    isCustomizerOpen: boolean;
    handleCloseCustomizer: () => void;
    addItemToOrder: (item: MenuItem) => void;
  }) => React.ReactNode;
}

const OrderManager = ({ menuItems, children }: OrderManagerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderItems, setOrderItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [tableId, setTableId] = useState<number | null>(null);
  const [tableTime, setTableTime] = useState<string | undefined>(undefined);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableTimeInterval, setTableTimeInterval] = useState<number | null>(null);

  // Function to format time duration
  const formatTimeDuration = (startTime: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Update the table time display
  const updateTableTime = () => {
    if (tableId !== null && tableActiveTimes[tableId]) {
      setTableTime(formatTimeDuration(tableActiveTimes[tableId]));
    }
  };

  // Parse URL query parameters for table information
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableIdParam = params.get('tableId');
    const tableNumberParam = params.get('tableNumber');
    const orderTypeParam = params.get('orderType') as OrderType | null;
    
    if (orderTypeParam && (orderTypeParam === 'dine-in' || orderTypeParam === 'to-go')) {
      setOrderType(orderTypeParam);
    }
    
    if (tableIdParam && tableNumberParam) {
      const parsedTableId = parseInt(tableIdParam);
      const parsedTableNumber = parseInt(tableNumberParam);
      
      setTableId(parsedTableId);
      setTableNumber(parsedTableNumber);
      setOrderType('dine-in'); // If table is specified, it's always dine-in
      
      // Set or initialize the table active time
      if (!tableActiveTimes[parsedTableId]) {
        tableActiveTimes[parsedTableId] = new Date();
      }
      
      // Update the table time immediately
      updateTableTime();
      
      // Set up an interval to update the table time every minute
      if (tableTimeInterval) {
        clearInterval(tableTimeInterval);
      }
      
      const interval = window.setInterval(updateTableTime, 60000); // Update every minute
      setTableTimeInterval(interval);
      
      // Load order items for this table
      if (tableOrders[parsedTableId]) {
        setOrderItems(tableOrders[parsedTableId]);
        toast.info(`Loaded order for Table ${parsedTableNumber}`);
      }
    } else {
      // Check if there's a saved order in localStorage when loading the page
      const savedOrder = localStorage.getItem('currentOrder');
      if (savedOrder) {
        try {
          const parsedOrder = JSON.parse(savedOrder);
          if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
            setOrderItems(parsedOrder);
          }
        } catch (e) {
          console.error('Failed to parse saved order', e);
        }
      }
      
      // Check if there's a saved order type in localStorage
      const savedOrderType = localStorage.getItem('orderType');
      if (savedOrderType && (savedOrderType === 'dine-in' || savedOrderType === 'to-go')) {
        setOrderType(savedOrderType as OrderType);
      }
    }
    
    // Clean up interval on unmount
    return () => {
      if (tableTimeInterval) {
        clearInterval(tableTimeInterval);
      }
    };
  }, [location.search]);

  // Update order type handler
  const handleSetOrderType = (type: OrderType) => {
    setOrderType(type);
    localStorage.setItem('orderType', type);
    
    // If switching to to-go, clear any table assignment
    if (type === 'to-go' && tableNumber !== null) {
      setTableId(null);
      setTableNumber(null);
      navigate('/orders');
    }
  };

  // Send to kitchen handler
  const handleSendToKitchen = () => {
    if (orderItems.length === 0) {
      toast.error("No items to send to kitchen");
      return;
    }
    
    toast.success(`Order sent to kitchen for ${tableNumber ? `Table ${tableNumber}` : orderType === 'dine-in' ? 'Dine-In' : 'To-Go'}`);
    
    // In a real application, you would send the order to a backend API
    console.log("Sending to kitchen:", {
      tableNumber,
      orderType,
      items: orderItems,
      timestamp: new Date().toISOString()
    });
  };

  const handleAddToOrder = (item: MenuItem) => {
    // If item has customizations, show customizer dialog
    if ((item.variations && item.variations.length > 0) || 
        (item.addons && item.addons.length > 0)) {
      setSelectedItem(item);
      setIsCustomizerOpen(true);
    } else {
      // Add directly to order with default options
      addItemToOrder({
        ...item,
        quantity: 1
      });
    }
  };

  const addItemToOrder = (item: MenuItem) => {
    setOrderItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => {
        // Check if the same item with the same customization exists
        const sameBase = i.id === item.id;
        const sameVariation = 
          (!i.selectedVariation && !item.selectedVariation) || 
          (i.selectedVariation?.id === item.selectedVariation?.id);
        
        // Check if selected add-ons are the same
        const sameAddons = 
          (!i.selectedAddons && !item.selectedAddons) ||
          (i.selectedAddons && item.selectedAddons && 
           i.selectedAddons.length === item.selectedAddons.length &&
           i.selectedAddons.every(addon => 
             item.selectedAddons?.some(a => a.id === addon.id)
           ));
        
        return sameBase && sameVariation && sameAddons;
      });

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: (newItems[existingItemIndex].quantity || 1) + (item.quantity || 1)
        };
        return newItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });

    // If we're viewing a table's order, update the tableOrders data
    if (tableId !== null) {
      tableOrders[tableId] = [...orderItems, item];
    }

    toast.success(`${item.name} added to order${tableNumber ? ` for Table ${tableNumber}` : ''}`);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    setOrderItems(prevItems => {
      const newItems = prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      // Update table orders if applicable
      if (tableId !== null) {
        tableOrders[tableId] = newItems;
      }
      
      return newItems;
    });
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      
      // Update table orders if applicable
      if (tableId !== null) {
        tableOrders[tableId] = newItems;
      }
      
      return newItems;
    });
  };

  const handleClearOrder = () => {
    setOrderItems([]);
    
    // Update table orders if applicable
    if (tableId !== null) {
      tableOrders[tableId] = [];
    }
  };

  const handleCheckout = () => {
    // Save current order and order type to localStorage
    localStorage.setItem('currentOrder', JSON.stringify(orderItems));
    localStorage.setItem('orderType', orderType);
    
    // Navigate to checkout page with the current order
    navigate('/checkout', { 
      state: { 
        items: orderItems, 
        tableId: tableId,
        tableNumber: tableNumber,
        orderType: orderType
      } 
    });
  };

  const handleClearTableFilter = () => {
    // Clear table filter and reset to regular order
    setTableId(null);
    setTableNumber(null);
    setOrderItems([]);
    setTableTime(undefined);
    
    // Clear the interval
    if (tableTimeInterval) {
      clearInterval(tableTimeInterval);
      setTableTimeInterval(null);
    }
    
    // Update URL to remove query parameters
    navigate('/orders');
  };

  const handleCloseCustomizer = () => {
    setIsCustomizerOpen(false);
    setSelectedItem(null);
  };

  return children({
    orderItems,
    tableNumber,
    tableTime,
    orderType,
    setOrderType: handleSetOrderType,
    handleAddToOrder,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearOrder,
    handleCheckout,
    handleSendToKitchen,
    handleClearTableFilter,
    selectedItem,
    isCustomizerOpen,
    handleCloseCustomizer,
    addItemToOrder
  });
};

export default OrderManager;
