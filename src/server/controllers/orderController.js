
// Sample data store (replace with database in production)
let orders = require('../data/orders');

// Get all orders
exports.getOrders = (req, res) => {
  // Filter by order type if provided
  const { orderType, tableId } = req.query;
  
  let filteredOrders = [...orders];
  
  if (orderType) {
    filteredOrders = filteredOrders.filter(order => order.orderType === orderType);
  }
  
  if (tableId) {
    filteredOrders = filteredOrders.filter(order => order.tableId == tableId);
  }
  
  res.json(filteredOrders);
};

// Get order by ID
exports.getOrderById = (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
};

// Create new order
exports.createOrder = (req, res) => {
  const { items, tableId, tableNumber, orderType } = req.body;
  
  if (!items || !items.length) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }
  
  const newOrder = {
    id: `ORD-${Date.now()}`,
    items,
    tableId,
    tableNumber,
    orderType: orderType || 'dine-in',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
};

// Update order
exports.updateOrder = (req, res) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  const updatedOrder = {
    ...orders[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  orders[index] = updatedOrder;
  res.json(updatedOrder);
};

// Delete order
exports.deleteOrder = (req, res) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  orders.splice(index, 1);
  res.json({ message: 'Order deleted successfully' });
};

// Send order to kitchen
exports.sendToKitchen = (req, res) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  // Update order status to 'in-kitchen'
  orders[index] = {
    ...orders[index],
    status: 'in-kitchen',
    sentToKitchenAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    message: 'Order sent to kitchen successfully',
    order: orders[index]
  });
};
