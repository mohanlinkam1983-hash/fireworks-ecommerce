import express from 'express';
import WholesaleController from '../controllers/WholesaleController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Routes
router.get('/', WholesaleController.getAll);
router.get('/:id', WholesaleController.getById);
router.post('/', upload.single('image'), WholesaleController.create);
router.put('/:id', upload.single('image'), WholesaleController.update);
router.delete('/:id', WholesaleController.delete);

export default router;
