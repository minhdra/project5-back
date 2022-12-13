const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
      max: 255,
    },
    path: {
      type: String,
      required: true,
      max: 255,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
    },
    category: {
      type: Number,
      required: true,
    },
    category_sub: {
      type: Number,
    },
    brand: {
      type: Number,
      require: true,
    },
    collect: {
      type: Number,
    },
    supplier: {
      type: Number,
    },
    origin: {
      type: String,
      require: true,
    },
    material: {
      type: String,
    },
    style: {
      type: String,
    },
    description: {
      type: String,
    },
    variants: {
      type: Array,
      required: true,
    },
    // createdId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    // },
    // updatedId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    // },
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

module.exports = mongoose.model('products', productSchema);
