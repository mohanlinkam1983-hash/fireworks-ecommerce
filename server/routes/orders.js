import express from 'express';
import OrderController from '../controllers/OrderController.js';

const router = express.Router();

// Routes
router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getById);
router.post('/', OrderController.create);
router.put('/:id/status', OrderController.updateStatus);
router.delete('/:id', OrderController.delete);

export default router;
