const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    discount_name: {
      type: String,
    },
    discount_percent: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
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

module.exports = mongoose.model('discounts', discountSchema);
