const WholesaleProduct = require('../models/WholesaleProduct');
const sharp = require('sharp');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

class WholesaleProductController {
  static async getAll(req, res) {
    try {
      const { category_id, search, sort } = req.query;
      const products = await WholesaleProduct.getAll({ category_id, search, sort });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const product = await WholesaleProduct.getById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { product_number, category_id, name_en, name_ta, packing, unit_price, price, description, enabled } = req.body;
      
      let image_url = '';
      if (req.file) {
        const filename = `${Date.now()}_${req.file.originalname}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        
        await sharp(req.file.buffer)
          .resize(400, 400, { fit: 'cover' })
          .toFile(filepath);
        
        image_url = `/uploads/${filename}`;
      }

      const result = await WholesaleProduct.create({
        product_number,
        category_id,
        name_en,
        name_ta,
        packing,
        unit_price,
        price,
        image_url,
        description,
        enabled
      });

      res.status(201).json({ id: result.id, message: 'Wholesale product created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { product_number, category_id, name_en, name_ta, packing, unit_price, price, description, enabled } = req.body;
      
      const product = await WholesaleProduct.getById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      let image_url = product.image_url;
      if (req.file) {
        const filename = `${Date.now()}_${req.file.originalname}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        
        await sharp(req.file.buffer)
          .resize(400, 400, { fit: 'cover' })
          .toFile(filepath);
        
        image_url = `/uploads/${filename}`;
      }

      await WholesaleProduct.update(id, {
        product_number,
        category_id,
        name_en,
        name_ta,
        packing,
        unit_price,
        price,
        image_url,
        description,
        enabled
      });

      res.json({ message: 'Wholesale product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await WholesaleProduct.getById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await WholesaleProduct.delete(id);
      res.json({ message: 'Wholesale product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = WholesaleProductController;
