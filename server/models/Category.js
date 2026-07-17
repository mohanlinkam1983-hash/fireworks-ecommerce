import db from '../database/db.js';

class Category {
    static getAll() {
        try {
            const stmt = db.prepare('SELECT * FROM categories ORDER BY name');
            return stmt.all();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    static getById(id) {
        try {
            const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
            return stmt.get(id);
        } catch (error) {
            console.error('Error fetching category:', error);
            return null;
        }
    }

    static create(data) {
        try {
            const stmt = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
            return stmt.run(data.name, data.description);
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    static update(id, data) {
        try {
            const stmt = db.prepare('UPDATE categories SET name = ?, description = ? WHERE id = ?');
            return stmt.run(data.name, data.description, id);
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    static delete(id) {
        try {
            const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
            return stmt.run(id);
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}

export default Category;
