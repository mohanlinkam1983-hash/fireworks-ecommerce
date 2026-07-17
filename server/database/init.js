const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database.db');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  // Categories Table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products Table (Retail)
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_number TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    packing TEXT NOT NULL,
    mrp REAL NOT NULL,
    offer_price REAL NOT NULL,
    image_url TEXT,
    description TEXT,
    type TEXT DEFAULT 'retail',
    enabled INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);

  // Wholesale Products Table
  db.run(`CREATE TABLE IF NOT EXISTS wholesale_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_number TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    packing TEXT NOT NULL,
    unit_price REAL NOT NULL,
    price REAL NOT NULL,
    image_url TEXT,
    description TEXT,
    enabled INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);

  // Customers Table
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders Table (Retail)
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    order_type TEXT DEFAULT 'retail',
    subtotal REAL NOT NULL,
    discount REAL DEFAULT 0,
    delivery_charge REAL DEFAULT 0,
    grand_total REAL NOT NULL,
    status TEXT DEFAULT 'Pending',
    special_instructions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )`);

  // Order Items Table
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    total_price REAL NOT NULL,
    product_type TEXT DEFAULT 'retail',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  )`);

  // Admin Users Table
  db.run(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Website Settings Table
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT,
    logo_url TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    bank_details TEXT,
    upi_qr_url TEXT,
    social_links TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert default admin user (username: admin, password: admin123)
  const bcrypt = require('bcrypt');
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  
  db.run(`INSERT OR IGNORE INTO admin_users (username, password, email, role) 
    VALUES (?, ?, ?, ?)`, 
    ['admin', hashedPassword, 'admin@fireworks.com', 'admin']
  );

  // Insert default categories
  const defaultCategories = [
    'Sparklers',
    'Fancy Items',
    'Bombs',
    'Chakkars',
    'Rockets',
    'Gift Boxes',
    'Matches'
  ];

  defaultCategories.forEach(category => {
    db.run(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, [category]);
  });

  // Insert default settings
  db.run(`INSERT OR IGNORE INTO settings (company_name, phone, email, address) 
    VALUES (?, ?, ?, ?)`,
    ['Fireworks Store', '+91-XXXXXXXXXX', 'info@fireworks.com', 'Your Address Here']
  );

  console.log('Database initialized successfully!');
});

db.close();
