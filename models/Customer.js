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
    email: {
      type: String,
    },
    birth: {
      type: Date,
    },
    avatar: {
      type: String,
    },
    address: {
      type: Object,
    },
    phone: {
      type: Number,
    },
    carts: {
      type: Array,
      required: true,
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