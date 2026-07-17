import db from '../database/db.js';

class CustomerController {
    static getAll(req, res) {
        try {
            const stmt = db.prepare('SELECT * FROM customers ORDER BY created_at DESC');
            const customers = stmt.all();
            res.json(customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ error: 'Error fetching customers' });
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params;
            const stmt = db.prepare('SELECT * FROM customers WHERE id = ?');
            const customer = stmt.get(id);

            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            const ordersStmt = db.prepare('SELECT * FROM orders WHERE customer_id = ?');
            const orders = ordersStmt.all(id);

            res.json({ ...customer, orders });
        } catch (error) {
            console.error('Error fetching customer:', error);
            res.status(500).json({ error: 'Error fetching customer' });
        }
    }
}

export default CustomerController;
