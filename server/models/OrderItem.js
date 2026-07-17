const db = require('../database/db');

class OrderItem {
  static async create(data) {
    const sql = `INSERT INTO order_items 
      (order_id, product_id, quantity, unit_price, total_price, product_type) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    return await db.run(sql, [
      data.order_id,
      data.product_id,
      data.quantity,
      data.unit_price,
      data.total_price,
      data.product_type || 'retail'
    ]);
  }

  static async getByOrderId(order_id) {
    const sql = `SELECT oi.*, p.name_en, p.name_ta, p.image_url 
      FROM order_items oi 
      LEFT JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ? AND oi.product_type = 'retail'
      UNION ALL
      SELECT oi.*, wp.name_en, wp.name_ta, wp.image_url 
      FROM order_items oi 
      LEFT JOIN wholesale_products wp ON oi.product_id = wp.id 
      WHERE oi.order_id = ? AND oi.product_type = 'wholesale'`;
    return await db.all(sql, [order_id, order_id]);
  }

  static async deleteByOrderId(order_id) {
    const sql = 'DELETE FROM order_items WHERE order_id = ?';
    return await db.run(sql, [order_id]);
  }
}

module.exports = OrderItem;
