const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', ProductController.getAllRetail);
router.get('/:id', ProductController.getById);
router.post('/', upload.single('image'), ProductController.create);
router.put('/:id', upload.single('image'), ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;
