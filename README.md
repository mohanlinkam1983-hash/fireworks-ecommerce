# Online Fireworks Ordering & Order Management System

A modern, fully functional fireworks eCommerce website with admin panel built with Node.js, Express, SQLite, HTML5, CSS3, and Tailwind CSS.

## Features

### Customer Website
- ✅ Retail Product Listing (with pricing and offers)
- ✅ Wholesale Product Listing
- ✅ Product Search (by name, Tamil name, product number)
- ✅ Shopping Cart with live totals
- ✅ Customer Checkout
- ✅ Unique Order ID Generation (Retail: SM prefix, Wholesale: WS prefix)
- ✅ PDF Invoice Generation & Download
- ✅ Order Confirmation Page
- ✅ Responsive Design (Mobile, Tablet, Desktop)

### Admin Panel
- ✅ Admin Login
- ✅ Dashboard with KPIs (Orders, Revenue, Products)
- ✅ Retail Order Management
- ✅ Wholesale Order Management
- ✅ Retail Product Management (Add/Edit/Delete)
- ✅ Wholesale Product Management (Add/Edit/Delete)
- ✅ Category Management (Create/Edit/Delete)
- ✅ Customer Management
- ✅ Bulk Product Upload (Excel/CSV)
- ✅ Export Products (Excel/CSV/PDF)
- ✅ Reports (Daily/Monthly)
- ✅ Website Settings (Logo, Company Details, etc.)

### Technical Stack
- **Frontend**: HTML5, CSS3, Tailwind CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite3
- **PDF Generation**: PDFKit
- **Excel**: xlsx library
- **Image Processing**: Sharp

## Installation

```bash
# Install dependencies
npm install

# Create database and tables
npm run init-db

# Start the application
npm start
```

The application will run on `http://localhost:3000`

## Default Admin Credentials
- **Username**: admin
- **Password**: admin123

## Project Structure

```
fireworks-ecommerce/
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── database/
│   └── server.js
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
├── views/
│   ├── customer/
│   ├── admin/
│   └── shared/
├── package.json
└── README.md
```

## Usage

### For Customers
1. Browse retail or wholesale products
2. Search and filter products by category
3. Add items to cart (auto-added when quantity > 0)
4. View cart and proceed to checkout
5. Enter delivery details
6. Submit order
7. Download PDF invoice

### For Admin
1. Log in with admin credentials
2. Manage products, categories, and orders
3. View dashboard with sales metrics
4. Download reports and export data
5. Update website settings

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### Auth
- `POST /api/auth/login` - Admin login

## License

Proprietary - All rights reserved
