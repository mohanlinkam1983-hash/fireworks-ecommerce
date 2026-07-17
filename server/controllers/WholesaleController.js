import db from '../database/db.js';

class WholesaleController {
    static getAll(req, res) {
        try {
            const { category_id, sort } = req.query;
            let sql = 'SELECT * FROM wholesale_products WHERE enabled = 1';
            const params = [];

            if (category_id) {
                sql += ' AND category_id = ?';
                params.push(category_id);
            }

            if (sort === 'alphabetical') {
                sql += ' ORDER BY name_en ASC';
            } else if (sort === 'price_low') {
                sql += ' ORDER BY price ASC';
            } else if (sort === 'price_high') {
                sql += ' ORDER BY price DESC';
            } else if (sort === 'newest') {
                sql += ' ORDER BY created_at DESC';
            } else {
                sql += ' ORDER BY created_at DESC';
            }

            const stmt = db.prepare(sql);
            const products = stmt.all(...params);
            res.json(products);
        } catch (error) {
            console.error('Error fetching wholesale products:', error);
            res.status(500).json({ error: 'Error fetching wholesale products' });
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params;
            const stmt = db.prepare('SELECT * FROM wholesale_products WHERE id = ?');
            const product = stmt.get(id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: 'Error fetching product' });
        }
    }

    static create(req, res) {
        try {
            const { product_number, category_id, name_en, name_ta, packing, unit_price, price, description } = req.body;
            const image_url = req.file ? `/uploads/${req.file.filename}` : null;

            if (!product_number || !category_id || !name_en || !unit_price || !price) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const stmt = db.prepare(
                'INSERT INTO wholesale_products (product_number, category_id, name_en, name_ta, packing, unit_price, price, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            const result = stmt.run(product_number, category_id, name_en, name_ta, packing, unit_price, price, image_url, description);

            res.status(201).json({ id: result.lastInsertRowid, message: 'Wholesale product created successfully' });
        } catch (error) {
            console.error('Error creating wholesale product:', error);
            res.status(500).json({ error: 'Error creating wholesale product' });
        }
    }

    static update(req, res) {
        try {
            const { id } = req.params;
            const { product_number, category_id, name_en, name_ta, packing, unit_price, price, description } = req.body;

            const stmt = db.prepare(
                'UPDATE wholesale_products SET product_number = ?, category_id = ?, name_en = ?, name_ta = ?, packing = ?, unit_price = ?, price = ?, description = ? WHERE id = ?'
            );
            stmt.run(product_number, category_id, name_en, name_ta, packing, unit_price, price, description, id);

            res.json({ message: 'Wholesale product updated successfully' });
        } catch (error) {
            console.error('Error updating wholesale product:', error);
            res.status(500).json({ error: 'Error updating wholesale product' });
        }
    }

    static delete(req, res) {
        try {
            const { id } = req.params;
            const stmt = db.prepare('DELETE FROM wholesale_products WHERE id = ?');
            stmt.run(id);

            res.json({ message: 'Wholesale product deleted successfully' });
        } catch (error) {
            console.error('Error deleting wholesale product:', error);
            res.status(500).json({ error: 'Error deleting wholesale product' });
        }
    }
}

export default WholesaleController;
