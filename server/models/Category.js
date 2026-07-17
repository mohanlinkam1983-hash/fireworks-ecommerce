const db = require('../database/db');

class Category {
    static async getAll() {
        const sql = 'SELECT * FROM categories ORDER BY name';
        return await db.all(sql, []);
    }

    static async getById(id) {
        const sql = 'SELECT * FROM categories WHERE id = ?';
        return await db.get(sql, [id]);
    }

    static async create(data) {
        const sql = 'INSERT INTO categories (name, description) VALUES (?, ?)';
        return await db.run(sql, [data.name, data.description]);
    }

    static async update(id, data) {
        const sql = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
        return await db.run(sql, [data.name, data.description, id]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM categories WHERE id = ?';
        return await db.run(sql, [id]);
    }
}

module.exports = Category;
