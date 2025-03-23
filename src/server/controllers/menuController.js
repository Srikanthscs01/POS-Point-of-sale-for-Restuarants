
// Sample data store (replace with database in production)
let menuItems = require('../data/menuItems');

// Get all menu items
exports.getMenuItems = (req, res) => {
  // Filter by category if provided
  const { category } = req.query;
  
  if (category && category !== 'All') {
    const filteredItems = menuItems.filter(item => item.category === category);
    return res.json(filteredItems);
  }
  
  res.json(menuItems);
};

// Get menu item by ID
exports.getMenuItemById = (req, res) => {
  const menuItem = menuItems.find(item => item.id === req.params.id);
  
  if (!menuItem) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  
  res.json(menuItem);
};

// Create new menu item
exports.createMenuItem = (req, res) => {
  const { name, price, description, category, image } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price and category are required' });
  }
  
  const newMenuItem = {
    id: `item${menuItems.length + 1}`,
    name,
    price,
    description: description || '',
    category,
    image: image || '/placeholder.svg',
  };
  
  menuItems.push(newMenuItem);
  res.status(201).json(newMenuItem);
};

// Update menu item
exports.updateMenuItem = (req, res) => {
  const index = menuItems.findIndex(item => item.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  
  menuItems[index] = {
    ...menuItems[index],
    ...req.body
  };
  
  res.json(menuItems[index]);
};

// Delete menu item
exports.deleteMenuItem = (req, res) => {
  const index = menuItems.findIndex(item => item.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  
  menuItems.splice(index, 1);
  res.json({ message: 'Menu item deleted successfully' });
};
