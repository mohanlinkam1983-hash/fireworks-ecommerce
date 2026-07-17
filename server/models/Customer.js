const db = require('../database/db');

class Customer {
  static async create(data) {
    const sql = `INSERT INTO customers 
      (name, mobile, whatsapp, email, city, state, pincode, address) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const result = await db.run(sql, [
      data.name,
      data.mobile,
      data.whatsapp || data.mobile,
      data.email || '',
      data.city,
      data.state || '',
      data.pincode,
      data.address
    ]);
    return result;
  }

  static async getAll() {
    const sql = `SELECT c.*, COUNT(o.id) as total_orders, SUM(o.grand_total) as total_purchase 
      FROM customers c 
      LEFT JOIN orders o ON c.id = o.customer_id 
      GROUP BY c.id 
      ORDER BY c.created_at DESC`;
    return await db.all(sql);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM customers WHERE id = ?';
    return await db.get(sql, [id]);
  }

  static async update(id, data) {
    const sql = `UPDATE customers SET 
      name = ?, mobile = ?, whatsapp = ?, email = ?, city = ?, state = ?, pincode = ?, address = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?`;
    return await db.run(sql, [
      data.name,
      data.mobile,
      data.whatsapp,
      data.email,
      data.city,
      data.state,
      data.pincode,
      data.address,
      id
    ]);
  }
}

module.exports = Customer;
