import express from 'express';
import SettingsController from '../controllers/SettingsController.js';

const router = express.Router();

// Routes
router.get('/', SettingsController.get);
router.put('/', SettingsController.update);

export default router;
