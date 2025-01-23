import mongoose from 'mongoose';

const StoreBillSchema = new mongoose.Schema({
  registerNo: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  totalLiters: {
    type: Number,
    required: true,
  },
  totalRakkam: {
    type: Number,
    required: true,
  },
  totalKapatRateMultiplybyTotalLiter: {
    type: Number,
    required: true,
  },
  totalBillKapat: {
    type: Number,
    required: true,
  },
  netPayment: {
    type: Number,
    required: true,
  },
  startDate: { // New field for start date
    type: Date,
    required: true,
  },
  endDate: { // New field for end date
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
},
}, { timestamps: true });

// Check if the model already exists before creating it
const StoreBill = mongoose.models.StoreBill || mongoose.model('StoreBill', StoreBillSchema);

export default StoreBill;
