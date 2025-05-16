
const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();


router.post('/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({ success: true, message: 'Customer data received' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error storing customer data', error });
  }
});


router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error fetching customers', error });
  }
});

module.exports = router;
