
const express = require('express');
const router = express.Router();
const { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');

// Get all menu items
router.get('/', getMenuItems);

// Get menu item by ID
router.get('/:id', getMenuItemById);

// Create new menu item
router.post('/', createMenuItem);

// Update menu item
router.put('/:id', updateMenuItem);

// Delete menu item
router.delete('/:id', deleteMenuItem);

module.exports = router;
