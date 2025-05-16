// models/FilterMap.js
const mongoose = require('mongoose');

const filterMapSchema = new mongoose.Schema({
  customer_id: { type: String, ref: 'Customer', required: true },
  segment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Segmentation', required: true },
  phone_number: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('FilterMap', filterMapSchema);
