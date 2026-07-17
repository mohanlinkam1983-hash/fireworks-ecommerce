import express from 'express';
import CustomerController from '../controllers/CustomerController.js';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Protected routes
router.get('/', AuthController.verifyToken, CustomerController.getAll);
router.get('/:id', AuthController.verifyToken, CustomerController.getById);

export default router;
