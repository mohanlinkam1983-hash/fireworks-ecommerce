const db = require('./db');

const initializeDatabase = () => {
    // Categories table
    db.run(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, []);

    // Products table (Retail)
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_number TEXT NOT NULL UNIQUE,
            category_id INTEGER NOT NULL,
            name_en TEXT NOT NULL,
            name_ta TEXT,
            packing TEXT,
            mrp REAL NOT NULL,
            offer_price REAL NOT NULL,
            image_url TEXT,
            description TEXT,
            enabled BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    `, []);

    // Wholesale Products table
    db.run(`
        CREATE TABLE IF NOT EXISTS wholesale_products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_number TEXT NOT NULL UNIQUE,
            category_id INTEGER NOT NULL,
            name_en TEXT NOT NULL,
            name_ta TEXT,
            packing TEXT,
            unit_price REAL NOT NULL,
            price REAL NOT NULL,
            image_url TEXT,
            description TEXT,
            enabled BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    `, []);

    // Customers table
    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            mobile TEXT NOT NULL UNIQUE,
            whatsapp TEXT,
            email TEXT UNIQUE,
            city TEXT,
            state TEXT,
            pincode TEXT,
            address TEXT,
            total_orders INTEGER DEFAULT 0,
            total_purchase REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, []);

    // Orders table
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL UNIQUE,
            customer_id INTEGER NOT NULL,
            order_type TEXT DEFAULT 'retail',
            subtotal REAL,
            discount REAL DEFAULT 0,
            delivery_charge REAL DEFAULT 0,
            grand_total REAL NOT NULL,
            status TEXT DEFAULT 'Pending',
            special_instructions TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    `, []);

    // Order Items table
    db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            total_price REAL NOT NULL,
            product_type TEXT DEFAULT 'retail',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id)
        )
    `, []);

    // Settings table
    db.run(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY DEFAULT 1,
            company_name TEXT,
            phone TEXT,
            whatsapp TEXT,
            email TEXT,
            address TEXT,
            bank_details TEXT,
            logo_url TEXT,
            social_links TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, []);

    // Admin Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            email TEXT,
            role TEXT DEFAULT 'admin',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, []);

    console.log('Database initialized successfully');
};

module.exports = { initializeDatabase };
