const mongoose = require('mongoose');

const userBillKapatSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  registerNo: {
    type: Number,
  },
  milktype:{
    type: String,
    required: true
  },
  orderData: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const BillKapat = mongoose.models.BillKapat || mongoose.model("BillKapat", userBillKapatSchema);

export default BillKapat;