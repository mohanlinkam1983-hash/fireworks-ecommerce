const db = require('../database/db');

class Settings {
  static async getAll() {
    const sql = 'SELECT * FROM settings LIMIT 1';
    return await db.get(sql);
  }

  static async update(data) {
    const sql = `UPDATE settings SET 
      company_name = ?, logo_url = ?, phone = ?, whatsapp = ?, email = ?, 
      address = ?, bank_details = ?, upi_qr_url = ?, social_links = ?, 
      updated_at = CURRENT_TIMESTAMP 
      WHERE id = 1`;
    return await db.run(sql, [
      data.company_name,
      data.logo_url,
      data.phone,
      data.whatsapp,
      data.email,
      data.address,
      data.bank_details,
      data.upi_qr_url,
      data.social_links
    ]);
  }
}

module.exports = Settings;
