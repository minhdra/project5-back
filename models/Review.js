const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    customer: {
      type: Number,
      required: true,
    },
    product: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    classify: {
      type: String,
    },
    comment: {
      type: String,
      required: true,
    },
    tags: {
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

module.exports = mongoose.model('reviews', reviewSchema);
