const Product = require('../models/Product');
const Category = require('../models/Category');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

class ProductController {
  static async getAllRetail(req, res) {
    try {
      const { category_id, search, sort } = req.query;
      const products = await Product.getAll({ category_id, search, sort });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const product = await Product.getById(req.params.id);
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
      const { product_number, category_id, name_en, name_ta, packing, mrp, offer_price, description, enabled } = req.body;
      
      let image_url = '';
      if (req.file) {
        const filename = `${Date.now()}_${req.file.originalname}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        
        await sharp(req.file.buffer)
          .resize(400, 400, { fit: 'cover' })
          .toFile(filepath);
        
        image_url = `/uploads/${filename}`;
      }

      const result = await Product.create({
        product_number,
        category_id,
        name_en,
        name_ta,
        packing,
        mrp,
        offer_price,
        image_url,
        description,
        enabled
      });

      res.status(201).json({ id: result.id, message: 'Product created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { product_number, category_id, name_en, name_ta, packing, mrp, offer_price, description, enabled } = req.body;
      
      const product = await Product.getById(id);
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

      await Product.update(id, {
        product_number,
        category_id,
        name_en,
        name_ta,
        packing,
        mrp,
        offer_price,
        image_url,
        description,
        enabled
      });

      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.getById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await Product.delete(id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductController;
