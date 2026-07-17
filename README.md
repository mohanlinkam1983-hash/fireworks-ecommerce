# Fireworks Store E-Commerce Platform

🎆 A comprehensive e-commerce solution for selling fireworks with separate retail and wholesale ordering systems.

## Features

### Customer Features
- **Retail Ordering**: Browse and purchase fireworks in small quantities
- **Wholesale Ordering**: Bulk ordering at competitive wholesale prices
- **Product Browsing**: Filter by category, search, and sort options
- **Shopping Cart**: Add/remove items, adjust quantities
- **Checkout**: Complete customer details and special instructions
- **Order Tracking**: Order confirmation with PDF invoice generation
- **Bilingual Support**: English and Tamil language support for products

### Admin Features
- **Dashboard**: Real-time analytics with total orders, customers, products, and revenue
- **Category Management**: Create, update, delete product categories
- **Product Management**: 
  - Retail products with MRP and offer prices
  - Wholesale products with unit and bulk pricing
  - Image uploads with automatic optimization
- **Order Management**: 
  - Track retail and wholesale orders separately
  - Update order status
  - View order details and customer information
- **Customer Management**: View all customers, their order history, and total purchases
- **Settings**: Configure company details, contact information, and bank details

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite3** for database
- **JWT** for authentication
- **Sharp** for image processing
- **PDFKit** for invoice generation
- **Multer** for file uploads

### Frontend
- **HTML5** & **CSS3**
- **Tailwind CSS** for styling
- **Vanilla JavaScript** for interactivity
- **LocalStorage** for cart management

## Project Structure

```
fireworks-ecommerce/
├── server/
│   ├── controllers/          # Business logic
│   │   ├── ProductController.js
│   │   ├── WholesaleProductController.js
│   │   ├── CategoryController.js
│   │   ├── OrderController.js
│   │   ├── CustomerController.js
│   │   ├── SettingsController.js
│   │   └── AuthController.js
│   ├── models/              # Database models
│   ├── routes/              # API endpoints
│   ├── database/            # Database setup
│   └── server.js            # Main server file
├── public/
│   ├── index.html           # Home page
│   ├── cart.html            # Shopping cart
│   ├── checkout.html        # Checkout page
│   ├── order-confirmation.html  # Order confirmation
│   ├── admin.html           # Admin dashboard
│   ├── js/
│   │   ├── app.js           # Frontend logic
│   │   ├── cart.js          # Cart management
│   │   ├── checkout.js      # Checkout logic
│   │   ├── order-confirmation.js
│   │   └── admin.js         # Admin functionality
│   ├── css/
│   │   ├── style.css        # Frontend styles
│   │   └── admin.css        # Admin styles
│   └── uploads/             # Product images
├── package.json
├── .env.example
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fireworks-ecommerce.git
   cd fireworks-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database**
   ```bash
   npm run db:init
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - **Customer Site**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin

## API Endpoints

### Products
- `GET /api/products` - Get all retail products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (multipart form)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Wholesale
- `GET /api/wholesale` - Get all wholesale products
- `GET /api/wholesale/:id` - Get product by ID
- `POST /api/wholesale` - Create product
- `PUT /api/wholesale/:id` - Update product
- `DELETE /api/wholesale/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order
- `GET /api/orders/:order_id/pdf` - Download invoice PDF

### Customers
- `GET /api/customers` - Get all customers (requires auth)
- `GET /api/customers/:id` - Get customer details

### Settings
- `GET /api/settings` - Get store settings
- `PUT /api/settings` - Update settings

### Authentication
- `POST /api/auth/login` - Admin login

## Default Admin Credentials

```
Username: admin
Password: admin123
```

**⚠️ Important**: Change these credentials immediately in production!

## Database Schema

The application uses SQLite with the following main tables:

- **categories** - Product categories
- **products** - Retail products
- **wholesale_products** - Wholesale products
- **orders** - Customer orders
- **order_items** - Items in each order
- **customers** - Customer information
- **settings** - Store configuration
- **admin_users** - Admin user accounts

## Features in Detail

### Shopping Cart
- Items stored in browser LocalStorage
- Real-time quantity updates
- Add/remove items
- Cart persists across browser sessions

### Checkout Process
1. Customer enters delivery details
2. Customer adds special instructions (optional)
3. Order review with itemized list
4. Order placement
5. Confirmation with order ID
6. PDF invoice download option

### Order Management
- Status tracking: Pending → Processing → Shipped → Delivered
- Separate dashboards for retail and wholesale orders
- Customer contact information readily available
- Order history searchable and filterable

### Image Handling
- Automatic image optimization using Sharp
- Images resized to 400x400px
- Stored in `public/uploads/` directory
- Served directly via web server

## Security Features

- JWT-based authentication for admin
- Password hashing with bcrypt
- CORS protection
- Input validation
- File upload restrictions

## Performance Optimization

- Image optimization and resizing
- Efficient database queries
- Client-side caching with LocalStorage
- Responsive design for all devices
- Gzip compression ready

## Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your_secure_random_secret
   ```

2. **Database Backup**
   - Regularly backup `database/fireworks.db`
   - Consider migrating to PostgreSQL for production

3. **Server Hosting**
   - Recommended: AWS EC2, Heroku, DigitalOcean
   - Use process manager like PM2
   - Enable HTTPS/SSL
   - Set up automated backups

4. **Nginx Configuration** (optional)
   ```nginx
   upstream app {
       server 127.0.0.1:3000;
   }

   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://app;
       }
   }
   ```

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Database Issues
```bash
# Reinitialize database
rm database/fireworks.db
npm run db:init
```

### Image Upload Issues
- Ensure `public/uploads/` directory exists
- Check file permissions
- Verify Multer configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@fireworksstore.com

## Roadmap

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] SMS notifications
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Inventory management
- [ ] Return/Exchange system
- [ ] Customer reviews and ratings

## Version History

### v1.0.0 (Initial Release)
- Complete e-commerce platform
- Retail and wholesale ordering
- Admin dashboard
- Order management
- Customer management

---

**Made with ❤️ for Fireworks Store**
