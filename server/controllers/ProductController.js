import db from '../database/db.js';

class ProductController {
    static getAll(req, res) {
        try {
            const { category_id, search, sort } = req.query;
            let sql = 'SELECT * FROM products WHERE enabled = 1';
            const params = [];

            if (category_id) {
                sql += ' AND category_id = ?';
                params.push(category_id);
            }

            if (search) {
                sql += ' AND (name_en LIKE ? OR name_ta LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }

            if (sort === 'alphabetical') {
                sql += ' ORDER BY name_en ASC';
            } else if (sort === 'price_low') {
                sql += ' ORDER BY offer_price ASC';
            } else if (sort === 'price_high') {
                sql += ' ORDER BY offer_price DESC';
            } else if (sort === 'newest') {
                sql += ' ORDER BY created_at DESC';
            } else {
                sql += ' ORDER BY created_at DESC';
            }

            const stmt = db.prepare(sql);
            const products = stmt.all(...params);
            res.json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Error fetching products' });
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params;
            const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
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
            const { product_number, category_id, name_en, name_ta, packing, mrp, offer_price, description } = req.body;
            const image_url = req.file ? `/uploads/${req.file.filename}` : null;

            if (!product_number || !category_id || !name_en || !mrp || !offer_price) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const stmt = db.prepare(
                'INSERT INTO products (product_number, category_id, name_en, name_ta, packing, mrp, offer_price, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            const result = stmt.run(product_number, category_id, name_en, name_ta, packing, mrp, offer_price, image_url, description);

            res.status(201).json({ id: result.lastInsertRowid, message: 'Product created successfully' });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Error creating product' });
        }
    }

    static update(req, res) {
        try {
            const { id } = req.params;
            const { product_number, category_id, name_en, name_ta, packing, mrp, offer_price, description } = req.body;

            const stmt = db.prepare(
                'UPDATE products SET product_number = ?, category_id = ?, name_en = ?, name_ta = ?, packing = ?, mrp = ?, offer_price = ?, description = ? WHERE id = ?'
            );
            stmt.run(product_number, category_id, name_en, name_ta, packing, mrp, offer_price, description, id);

            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Error updating product' });
        }
    }

    static delete(req, res) {
        try {
            const { id } = req.params;
            const stmt = db.prepare('DELETE FROM products WHERE id = ?');
            stmt.run(id);

            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Error deleting product' });
        }
    }
}

export default ProductController;
