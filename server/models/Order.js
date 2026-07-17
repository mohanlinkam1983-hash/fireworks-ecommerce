const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

class Order {
  static generateOrderId(type = 'retail') {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const prefix = type === 'retail' ? 'SM' : 'WS';
    const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
    return `${prefix}${year}${month}${random}`;
  }

  static async create(data) {
    const sql = `INSERT INTO orders 
      (order_id, customer_id, order_type, subtotal, discount, delivery_charge, grand_total, status, special_instructions) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const result = await db.run(sql, [
      data.order_id || this.generateOrderId(data.order_type),
      data.customer_id,
      data.order_type || 'retail',
      data.subtotal,
      data.discount || 0,
      data.delivery_charge || 0,
      data.grand_total,
      'Pending',
      data.special_instructions || ''
    ]);
    return result;
  }

  static async getAll(filters = {}) {
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (filters.order_type) {
      sql += ' AND order_type = ?';
      params.push(filters.order_type);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.search) {
      sql += ' AND order_id LIKE ?';
      params.push(`%${filters.search}%`);
    }

    sql += ' ORDER BY created_at DESC';
    return await db.all(sql, params);
  }

  static async getById(id) {
    const sql = `SELECT o.*, c.name, c.mobile, c.email, c.city, c.state, c.pincode, c.address, c.whatsapp 
      FROM orders o 
      LEFT JOIN customers c ON o.customer_id = c.id 
      WHERE o.id = ?`;
    return await db.get(sql, [id]);
  }

  static async getByOrderId(order_id) {
    const sql = `SELECT o.*, c.name, c.mobile, c.email, c.city, c.state, c.pincode, c.address, c.whatsapp 
      FROM orders o 
      LEFT JOIN customers c ON o.customer_id = c.id 
      WHERE o.order_id = ?`;
    return await db.get(sql, [order_id]);
  }

  static async update(id, data) {
    const sql = `UPDATE orders SET 
      status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?`;
    return await db.run(sql, [data.status, id]);
  }

  static async delete(id) {
    await db.run('DELETE FROM order_items WHERE order_id = ?', [id]);
    const sql = 'DELETE FROM orders WHERE id = ?';
    return await db.run(sql, [id]);
  }
}

module.exports = Order;
