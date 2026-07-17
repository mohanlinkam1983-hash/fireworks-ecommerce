const db = require('../database/db');

class Product {
  static async create(data) {
    const sql = `INSERT INTO products 
      (product_number, category_id, name_en, name_ta, packing, mrp, offer_price, image_url, description, enabled) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const result = await db.run(sql, [
      data.product_number,
      data.category_id,
      data.name_en,
      data.name_ta,
      data.packing,
      data.mrp,
      data.offer_price,
      data.image_url,
      data.description,
      data.enabled || 1
    ]);
    return result;
  }

  static async getAll(filters = {}) {
    let sql = 'SELECT * FROM products WHERE enabled = 1';
    const params = [];

    if (filters.category_id) {
      sql += ' AND category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.search) {
      sql += ' AND (name_en LIKE ? OR name_ta LIKE ? OR product_number LIKE ?)';
      const search = `%${filters.search}%`;
      params.push(search, search, search);
    }

    if (filters.sort === 'price_low') {
      sql += ' ORDER BY offer_price ASC';
    } else if (filters.sort === 'price_high') {
      sql += ' ORDER BY offer_price DESC';
    } else if (filters.sort === 'alphabetical') {
      sql += ' ORDER BY name_en ASC';
    } else if (filters.sort === 'newest') {
      sql += ' ORDER BY created_at DESC';
    } else {
      sql += ' ORDER BY product_number ASC';
    }

    return await db.all(sql, params);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM products WHERE id = ?';
    return await db.get(sql, [id]);
  }

  static async update(id, data) {
    const sql = `UPDATE products SET 
      product_number = ?, category_id = ?, name_en = ?, name_ta = ?, 
      packing = ?, mrp = ?, offer_price = ?, image_url = ?, 
      description = ?, enabled = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?`;
    return await db.run(sql, [
      data.product_number,
      data.category_id,
      data.name_en,
      data.name_ta,
      data.packing,
      data.mrp,
      data.offer_price,
      data.image_url,
      data.description,
      data.enabled || 1,
      id
    ]);
  }

  static async delete(id) {
    const sql = 'DELETE FROM products WHERE id = ?';
    return await db.run(sql, [id]);
  }

  static async getByProductNumber(product_number) {
    const sql = 'SELECT * FROM products WHERE product_number = ?';
    return await db.get(sql, [product_number]);
  }
}

module.exports = Product;
