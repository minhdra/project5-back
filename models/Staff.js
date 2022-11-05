const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
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
