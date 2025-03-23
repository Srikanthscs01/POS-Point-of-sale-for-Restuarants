
// Sample orders data
module.exports = [
  {
    id: 'ORD-5392',
    tableId: 2,
    tableNumber: 2,
    orderType: 'dine-in',
    items: [
      { id: 'item1', name: 'Margherita Pizza', price: 12.99, description: 'Classic cheese pizza with tomato sauce', image: '/placeholder.svg', category: 'Pizza', quantity: 2 },
      { id: 'item2', name: 'Garlic Bread', price: 4.99, description: 'Toasted bread with garlic butter', image: '/placeholder.svg', category: 'Sides', quantity: 1 },
      { id: 'item3', name: 'Cola', price: 2.49, description: 'Refreshing cola drink', image: '/placeholder.svg', category: 'Beverages', quantity: 1 }
    ],
    status: 'in-kitchen',
    createdAt: '2023-07-15T12:35:00Z',
    updatedAt: '2023-07-15T12:40:00Z',
    sentToKitchenAt: '2023-07-15T12:40:00Z'
  },
  {
    id: 'ORD-5389',
    tableId: 5,
    tableNumber: 5,
    orderType: 'dine-in',
    items: [
      { id: 'item4', name: 'Chicken Caesar Salad', price: 9.99, description: 'Fresh salad with grilled chicken', image: '/placeholder.svg', category: 'Salads', quantity: 1 },
      { id: 'item5', name: 'French Fries', price: 3.99, description: 'Crispy golden french fries', image: '/placeholder.svg', category: 'Sides', quantity: 2 }
    ],
    status: 'pending',
    createdAt: '2023-07-15T12:10:00Z',
    updatedAt: '2023-07-15T12:10:00Z'
  },
  {
    id: 'ORD-5387',
    tableId: null,
    tableNumber: null,
    orderType: 'to-go',
    items: [
      { id: 'item11', name: 'Mushroom Risotto', price: 15.99, description: 'Creamy rice with mushrooms', image: '/placeholder.svg', category: 'Mains', quantity: 1 },
      { id: 'item12', name: 'Bruschetta', price: 6.99, description: 'Toasted bread with tomatoes and basil', image: '/placeholder.svg', category: 'Appetizers', quantity: 2 }
    ],
    status: 'completed',
    createdAt: '2023-07-15T11:55:00Z',
    updatedAt: '2023-07-15T12:15:00Z',
    sentToKitchenAt: '2023-07-15T12:00:00Z'
  }
];
