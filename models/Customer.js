const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    birth: {
      type: Date,
    },
    // 2 is default, 0 is male, 1 is female
    gender: {
      type: Number,
      default: 2,
    },
    avatar: {
      type: String,
    },
    address: {
      type: Object,
    },
    phone: {
      type: String,
    },
    carts: {
      type: Array,
      required: true,
      default: [],
    },
    delivery_addresses: {
      type: Array,
      default: [],
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

module.exports = mongoose.model('customers', customerSchema);
