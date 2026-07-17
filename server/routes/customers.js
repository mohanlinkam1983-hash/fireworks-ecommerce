const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');

router.get('/', CustomerController.getAll);
router.get('/:id', CustomerController.getById);

module.exports = router;
