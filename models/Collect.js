const mongoose = require('mongoose');

const collectSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    collect_name: {
      type: String,
      required: true,
      max: 255,
    },
    order: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
    path: {
      type: String,
      required: true,
    },
    hashtag: {
      type: String,
    },
    thumbnail: {
      type: String,
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

module.exports = mongoose.model('collects', collectSchema);
