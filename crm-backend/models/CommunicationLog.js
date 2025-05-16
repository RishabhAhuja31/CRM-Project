
const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
    merchant_id: { type: String, required: true },
    communication_id: { type: String, required: true, index: true }, 
    communication_type: { type: Number, enum: 2 },
    customer_id: { type: String, required: true }, 
    variation_id: { type: String },
    cohort_id: { type: String },
    split_group: { type: Number, enum: [1, 2, 3] },
    channel: { type: Number, enum: [1, 2, 3, 4, 5, 6] },
    channel_table_id: { type: String },
    delivery_status: { type: Number},
    retrigger_count: { type: Number, default: 0 },
    scheduled_time: { type: Date },
    sent_time: { type: Date },
    delivered_time: { type: Date },
    ack_id: { type: String },
    content: { type: String },
    credit_used: { type: Number, default: 0 },
    batch_id: { type: String },
    vendor_id: { type: mongoose.Types.ObjectId, index: true },
    sender_id: { type: String },
    delivery_reason: { type: String },
    campaign_name: { type: String }, 
    created_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunicationLog', communicationLogSchema);
