const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: String,
  customer_id: String,
  merchant_id: String,
  amount: Number,
  discount: Number,
  channel: String,
  type: String,
  status: Number,
  bill_no: String,
  created_on: Date,
  location_id: String,
});

module.exports = mongoose.model('Order', orderSchema);
