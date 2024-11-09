// models/OrderModel.js

import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  milktype: {
    type: String,
    required: true,
  },
  kharediData: {
    type: String,
    required: true,
  },
  rakkam: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
