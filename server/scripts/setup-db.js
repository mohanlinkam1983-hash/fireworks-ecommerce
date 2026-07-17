#!/usr/bin/env node
import db from '../database/db.js';
import { initializeDatabase } from '../database/init.js';
import bcrypt from 'bcrypt';

const createAdminUser = async () => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const stmt = db.prepare('INSERT OR IGNORE INTO admin_users (username, password, email, role) VALUES (?, ?, ?, ?)');
        stmt.run('admin', hashedPassword, 'admin@fireworks.com', 'admin');
        console.log('✅ Admin user created/verified');
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
};

const addDefaultSettings = () => {
    try {
        const stmt = db.prepare('INSERT OR IGNORE INTO settings (id, company_name, phone, email) VALUES (?, ?, ?, ?)');
        stmt.run(1, 'Fireworks Store', '+91-XXXXXXXXXX', 'info@fireworks.com');
        console.log('✅ Default settings created/verified');
    } catch (error) {
        console.error('❌ Error creating settings:', error);
    }
};

const main = async () => {
    console.log('🔧 Initializing database...');
    initializeDatabase();
    console.log('👤 Setting up admin user...');
    await createAdminUser();
    console.log('⚙️  Setting up default configuration...');
    addDefaultSettings();
    console.log('✨ Database setup completed!');
    process.exit(0);
};

main();
