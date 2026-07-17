const Category = require('../models/Category');

class CategoryController {
  static async getAll(req, res) {
    try {
      const categories = await Category.getAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const category = await Category.getById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      const result = await Category.create({ name, description });
      res.status(201).json({ id: result.id, message: 'Category created successfully' });
    } catch (error) {
      if (error.message.includes('UNIQUE')) {
        res.status(400).json({ error: 'Category already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      const category = await Category.getById(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await Category.update(id, { name, description });
      res.json({ message: 'Category updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.getById(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await Category.delete(id);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CategoryController;
