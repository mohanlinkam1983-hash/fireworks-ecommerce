import db from '../database/db.js';

class SettingsController {
    static get(req, res) {
        try {
            const stmt = db.prepare('SELECT * FROM settings WHERE id = 1');
            const settings = stmt.get();
            res.json(settings || {});
        } catch (error) {
            console.error('Error fetching settings:', error);
            res.status(500).json({ error: 'Error fetching settings' });
        }
    }

    static update(req, res) {
        try {
            const { company_name, phone, whatsapp, email, address, bank_details } = req.body;

            const stmt = db.prepare(
                'UPDATE settings SET company_name = ?, phone = ?, whatsapp = ?, email = ?, address = ?, bank_details = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1'
            );
            stmt.run(company_name, phone, whatsapp, email, address, bank_details);

            res.json({ message: 'Settings updated successfully' });
        } catch (error) {
            console.error('Error updating settings:', error);
            res.status(500).json({ error: 'Error updating settings' });
        }
    }
}

export default SettingsController;
