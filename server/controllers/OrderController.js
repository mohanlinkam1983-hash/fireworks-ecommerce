import db from '../database/db.js';

class OrderController {
    static getAll(req, res) {
        try {
            const { order_type } = req.query;
            let sql = 'SELECT * FROM orders';
            const params = [];

            if (order_type) {
                sql += ' WHERE order_type = ?';
                params.push(order_type);
            }

            sql += ' ORDER BY created_at DESC';

            const stmt = db.prepare(sql);
            const orders = stmt.all(...params);
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Error fetching orders' });
        }
    }

    static getById(req, res) {
        try {
            const { id } = req.params;
            const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
            const order = stmt.get(id);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
            const items = itemsStmt.all(order.id);

            res.json({ ...order, items });
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({ error: 'Error fetching order' });
        }
    }

    static create(req, res) {
        try {
            const { customer, items, order_type, subtotal, discount, delivery_charge, grand_total, special_instructions } = req.body;

            if (!customer || !items || items.length === 0) {
                return res.status(400).json({ error: 'Invalid order data' });
            }

            // Create or get customer
            let customerId;
            try {
                const customerStmt = db.prepare(
                    'INSERT INTO customers (name, mobile, whatsapp, email, city, state, pincode, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                );
                const customerResult = customerStmt.run(
                    customer.name,
                    customer.mobile,
                    customer.whatsapp,
                    customer.email,
                    customer.city,
                    customer.state,
                    customer.pincode,
                    customer.address
                );
                customerId = customerResult.lastInsertRowid;
            } catch (err) {
                // Customer might already exist, try to find by mobile
                const findStmt = db.prepare('SELECT id FROM customers WHERE mobile = ?');
                const existingCustomer = findStmt.get(customer.mobile);
                if (existingCustomer) {
                    customerId = existingCustomer.id;
                } else {
                    throw err;
                }
            }

            // Generate order ID
            const orderId = 'SM' + new Date().getFullYear() + String(customerId).padStart(6, '0');

            // Create order
            const orderStmt = db.prepare(
                'INSERT INTO orders (order_id, customer_id, order_type, subtotal, discount, delivery_charge, grand_total, special_instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            const orderResult = orderStmt.run(orderId, customerId, order_type, subtotal, discount, delivery_charge, grand_total, special_instructions);

            // Add order items
            const itemStmt = db.prepare(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, product_type) VALUES (?, ?, ?, ?, ?, ?)'
            );

            items.forEach(item => {
                itemStmt.run(orderResult.lastInsertRowid, item.product_id, item.quantity, item.price, item.price * item.quantity, item.type);
            });

            res.status(201).json({ order_id: orderId, message: 'Order created successfully' });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Error creating order', details: error.message });
        }
    }

    static updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
            stmt.run(status, id);

            res.json({ message: 'Order status updated successfully' });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ error: 'Error updating order status' });
        }
    }

    static delete(req, res) {
        try {
            const { id } = req.params;
            const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
            stmt.run(id);

            res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).json({ error: 'Error deleting order' });
        }
    }
}

export default OrderController;
