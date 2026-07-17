import db from '../database/db.js';

class CategoryController {
    static getAll(req, res) {
        try {
            const stmt = db.prepare('SELECT * FROM categories ORDER BY name');
            const categories = stmt.all();
            res.json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Error fetching categories' });
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params;
            const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
            const category = stmt.get(id);

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json(category);
        } catch (error) {
            console.error('Error fetching category:', error);
            res.status(500).json({ error: 'Error fetching category' });
        }
    }

    static create(req, res) {
        try {
            const { name, description } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Category name is required' });
            }

            const stmt = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
            const result = stmt.run(name, description || null);

            res.status(201).json({ id: result.lastInsertRowid, message: 'Category created successfully' });
        } catch (error) {
            console.error('Error creating category:', error);
            if (error.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Category name already exists' });
            }
            res.status(500).json({ error: 'Error creating category' });
        }
    }

    static update(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const stmt = db.prepare('UPDATE categories SET name = ?, description = ? WHERE id = ?');
            stmt.run(name, description, id);

            res.json({ message: 'Category updated successfully' });
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ error: 'Error updating category' });
        }
    }

    static delete(req, res) {
        try {
            const { id } = req.params;
            const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
            stmt.run(id);

            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ error: 'Error deleting category' });
        }
    }
}

export default CategoryController;
