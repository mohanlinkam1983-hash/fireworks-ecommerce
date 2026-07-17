import express from 'express';
import productRoutes from './products.js';
import wholesaleRoutes from './wholesale.js';
import categoryRoutes from './categories.js';
import orderRoutes from './orders.js';
import authRoutes from './auth.js';
import customerRoutes from './customers.js';
import settingsRoutes from './settings.js';

const router = express.Router();

// API Routes
router.use('/products', productRoutes);
router.use('/wholesale', wholesaleRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/settings', settingsRoutes);

export default router;
