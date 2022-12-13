const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    birth: {
      type: Date,
    },
    // true is male, false is female
    gender: {
      type: Boolean,
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
    first_name: {
      type: String,
    },
    last_name: {
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

module.exports = mongoose.model('staffs', staffSchema);
