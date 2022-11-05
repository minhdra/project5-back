const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    sub_category_name: {
      type: String,
      required: true,
      max: 255,
    },
    path: {
      type: String,
      required: true,
    },
    category: {
      type: Number,
      required: true,
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

module.exports = mongoose.model('sub_categories', subCategorySchema);
