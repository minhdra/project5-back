const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    brand_name: {
      type: String,
      required: true,
      max: 255,
    },
    path: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      require: true,
    },
    description: {
      type: String,
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

module.exports = mongoose.model('brands', brandSchema);
