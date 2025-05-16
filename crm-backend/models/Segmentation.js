const mongoose = require('mongoose');

const segmentationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  conditions: [
    {
      field: { type: String, required: true },
      operator: { type: String, required: true },
      value: { type: Number, required: true },
      logicalOperator: { type: String, required: true },
    },
  ],
  customerCount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Segmentation', segmentationSchema);
