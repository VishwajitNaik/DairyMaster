// models/OrderModel.js
import mongoose from 'mongoose';

const AdvanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  orderNo: {
    type: String,
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
  rakkam: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Advance || mongoose.model('Advance', AdvanceSchema);
