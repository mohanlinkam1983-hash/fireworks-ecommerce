const Settings = require('../models/Settings');
const sharp = require('sharp');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

class SettingsController {
  static async get(req, res) {
    try {
      const settings = await Settings.getAll();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const data = req.body;
      
      // Handle logo upload
      if (req.file) {
        const filename = `logo_${Date.now()}_${req.file.originalname}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        
        await sharp(req.file.buffer)
          .resize(200, 200, { fit: 'cover' })
          .toFile(filepath);
        
        data.logo_url = `/uploads/${filename}`;
      }

      // Handle social links as JSON
      if (typeof data.social_links === 'string') {
        data.social_links = JSON.stringify(JSON.parse(data.social_links));
      }

      await Settings.update(data);
      res.json({ message: 'Settings updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SettingsController;
