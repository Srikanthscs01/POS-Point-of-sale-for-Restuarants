
// Sample data store (replace with database in production)
let tables = require('../data/tables');

// Get all tables
exports.getTables = (req, res) => {
  // Filter by status if provided
  const { status } = req.query;
  
  if (status) {
    const filteredTables = tables.filter(table => table.status === status);
    return res.json(filteredTables);
  }
  
  res.json(tables);
};

// Get table by ID
exports.getTableById = (req, res) => {
  const table = tables.find(t => t.id == req.params.id);
  
  if (!table) {
    return res.status(404).json({ message: 'Table not found' });
  }
  
  res.json(table);
};

// Update table status
exports.updateTableStatus = (req, res) => {
  const { status, orderId } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  const index = tables.findIndex(t => t.id == req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Table not found' });
  }
  
  // Update table with new status
  tables[index] = {
    ...tables[index],
    status,
    order: status === 'occupied' ? { id: orderId || `ORD-${Date.now()}`, time: new Date().toLocaleTimeString() } : null
  };
  
  res.json(tables[index]);
};
