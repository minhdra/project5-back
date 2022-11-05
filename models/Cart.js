const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    details: {
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

module.exports = mongoose.model('carts', cartSchema);
