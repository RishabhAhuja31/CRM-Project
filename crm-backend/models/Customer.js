const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  id: String,
  customer_id: String,
  merchant_id: String,
  phone: String,
  customer_email: String,
  customer_name: String,
  last_visited: Date,
  number_of_visits: Number,
  join_channel: String,
  is_active: Number,
  created_on: Date,
  first_event: String,
  last_event: String,
  last_location: String,
  last_channel: String,
  total_spend: Number,
  join_location: String,
  loyalty_conf_id: String,
  usecase: String,
  pincode: String,
  gender: String,
  nationality: String,
  birthday: Date,
  country: String,
  city: String,
  state: String,
  language: String,
});

module.exports = mongoose.model('Customer', customerSchema);
