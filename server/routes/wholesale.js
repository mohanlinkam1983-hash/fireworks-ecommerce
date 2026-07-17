const express = require('express');
const router = express.Router();
const WholesaleProductController = require('../controllers/WholesaleProductController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', WholesaleProductController.getAll);
router.get('/:id', WholesaleProductController.getById);
router.post('/', upload.single('image'), WholesaleProductController.create);
router.put('/:id', upload.single('image'), WholesaleProductController.update);
router.delete('/:id', WholesaleProductController.delete);

module.exports = router;
