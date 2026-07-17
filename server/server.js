const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
const productRoutes = require('./routes/products');
const wholesaleRoutes = require('./routes/wholesale');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');
const settingsRoutes = require('./routes/settings');
const authRoutes = require('./routes/auth');
const AuthController = require('./controllers/AuthController');

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', AuthController.verifyToken, customerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Serve index.html for all non-API routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
