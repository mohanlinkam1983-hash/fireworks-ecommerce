const Customer = require('../models/Customer');

class CustomerController {
  static async getAll(req, res) {
    try {
      const customers = await Customer.getAll();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const customer = await Customer.getById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CustomerController;
