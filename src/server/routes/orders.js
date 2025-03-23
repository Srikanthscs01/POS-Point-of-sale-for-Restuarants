
const express = require('express');
const router = express.Router();
const { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, sendToKitchen } = require('../controllers/orderController');

// Get all orders
router.get('/', getOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Create new order
router.post('/', createOrder);

// Update order
router.put('/:id', updateOrder);

// Delete order
router.delete('/:id', deleteOrder);

// Send order to kitchen
router.post('/:id/send-to-kitchen', sendToKitchen);

module.exports = router;
