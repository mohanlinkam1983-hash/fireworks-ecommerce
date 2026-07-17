const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/SettingsController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', SettingsController.get);
router.put('/', upload.single('logo'), SettingsController.update);

module.exports = router;
