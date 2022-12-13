const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: Long,
      required: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    payment_type: {
      type: String,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    delivery_address: {
      type: Object,
      required: true,
    },
    note: {
      type: String,
    },
    total: {
      type: String,
      required: true,
    },
    details: {
      type: Array,
      default: [],
    },
    card_type: {
      type: String,
    },
    card_name: {
      type: String,
    },
    card_info: {
      type: String,
    },
    // 0 is delivered successful,
    // 1 is waiting confirm, 
    // 2 is confirmed and packaging, 
    // 3 is packaged and waiting deliverer
    // 4 is delivering
    // 5 is canceled
    // 6 is refunding
    // 7 is refunded
    delivery_status: {
      type: Number,
      default: 1,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('orders', orderSchema);
