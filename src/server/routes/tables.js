
const express = require('express');
const router = express.Router();
const { getTables, getTableById, updateTableStatus } = require('../controllers/tableController');

// Get all tables
router.get('/', getTables);

// Get table by ID
router.get('/:id', getTableById);

// Update table status
router.put('/:id/status', updateTableStatus);

module.exports = router;
