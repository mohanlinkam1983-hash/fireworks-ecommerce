import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Routes
router.post('/login', AuthController.login);

export default router;
