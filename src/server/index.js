
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orders');
const tableRoutes = require('./routes/tables');
const menuRoutes = require('./routes/menu');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/menu', menuRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Restaurant Management API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
