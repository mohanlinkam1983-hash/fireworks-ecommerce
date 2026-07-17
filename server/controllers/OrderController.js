const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const WholesaleProduct = require('../models/WholesaleProduct');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const Settings = require('../models/Settings');

class OrderController {
  static async create(req, res) {
    try {
      const { customer, items, subtotal, discount, delivery_charge, grand_total, special_instructions, order_type } = req.body;

      if (!customer || !items || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order data' });
      }

      // Create customer
      const customerResult = await Customer.create(customer);
      const customerId = customerResult.id;

      // Create order
      const orderId = Order.generateOrderId(order_type);
      const orderResult = await Order.create({
        order_id: orderId,
        customer_id: customerId,
        order_type: order_type || 'retail',
        subtotal,
        discount: discount || 0,
        delivery_charge: delivery_charge || 0,
        grand_total,
        special_instructions
      });

      // Create order items
      for (const item of items) {
        await OrderItem.create({
          order_id: orderResult.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          product_type: item.product_type || 'retail'
        });
      }

      res.status(201).json({
        order_id: orderId,
        message: 'Order created successfully',
        order_number: orderResult.id
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { order_type, status, search } = req.query;
      const orders = await Order.getAll({ order_type, status, search });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const order = await Order.getById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const items = await OrderItem.getByOrderId(req.params.id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByOrderId(req, res) {
    try {
      const order = await Order.getByOrderId(req.params.order_id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const items = await OrderItem.getByOrderId(order.id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.getById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      await Order.update(id, { status });
      res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.getById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      await Order.delete(id);
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async generatePDF(req, res) {
    try {
      const { order_id } = req.params;
      const order = await Order.getByOrderId(order_id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const items = await OrderItem.getByOrderId(order.id);
      const settings = await Settings.getAll();

      const doc = new PDFDocument();
      const filename = `invoice-${order_id}.pdf`;
      const filepath = path.join(__dirname, '../../public/uploads', filename);

      doc.pipe(fs.createWriteStream(filepath));

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text(settings?.company_name || 'Fireworks Store', { align: 'center' });
      doc.fontSize(10).text('Invoice', { align: 'center' });
      doc.moveDown();

      // Order Details
      doc.fontSize(10).font('Helvetica-Bold').text('Order Details:', { underline: true });
      doc.font('Helvetica').text(`Order ID: ${order.order_id}`);
      doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`);
      doc.text(`Status: ${order.status}`);
      doc.moveDown();

      // Customer Details
      doc.font('Helvetica-Bold').text('Customer Details:', { underline: true });
      doc.font('Helvetica');
      doc.text(`Name: ${order.name}`);
      doc.text(`Mobile: ${order.mobile}`);
      doc.text(`Email: ${order.email}`);
      doc.text(`Address: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}`);
      doc.moveDown();

      // Items Table
      doc.font('Helvetica-Bold').text('Items:', { underline: true });
      doc.font('Helvetica').fontSize(9);
      const tableTop = doc.y + 10;
      doc.text('Product', 50, tableTop);
      doc.text('Qty', 250, tableTop);
      doc.text('Price', 300, tableTop);
      doc.text('Total', 350, tableTop);

      let y = tableTop + 20;
      items.forEach((item) => {
        doc.text(item.name_en, 50, y);
        doc.text(item.quantity, 250, y);
        doc.text(`Rs. ${item.unit_price}`, 300, y);
        doc.text(`Rs. ${item.total_price}`, 350, y);
        y += 20;
      });

      doc.moveDown(2);
      doc.font('Helvetica-Bold');
      doc.text(`Subtotal: Rs. ${order.subtotal}`, 300);
      if (order.discount) doc.text(`Discount: Rs. ${order.discount}`, 300);
      if (order.delivery_charge) doc.text(`Delivery: Rs. ${order.delivery_charge}`, 300);
      doc.text(`Grand Total: Rs. ${order.grand_total}`, 300);

      doc.moveDown(2);
      doc.font('Helvetica').fontSize(10).text('Thank you for your order!', { align: 'center' });

      doc.end();

      doc.on('finish', () => {
        res.download(filepath);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = OrderController;
