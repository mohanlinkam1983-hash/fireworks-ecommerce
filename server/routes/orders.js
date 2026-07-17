const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.post('/', OrderController.create);
router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getById);
router.get('/order-id/:order_id', OrderController.getByOrderId);
router.put('/:id/status', OrderController.updateStatus);
router.delete('/:id', OrderController.delete);
router.get('/:order_id/pdf', OrderController.generatePDF);

module.exports = router;
