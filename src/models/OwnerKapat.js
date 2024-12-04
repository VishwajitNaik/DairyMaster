const mongoose = require('mongoose');

const onwerKapatSchema = new mongoose.Schema({
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
    ref: 'Owner',
    required: true,
  },
});

const OnwerKapat = mongoose.models.OnwerKapat || mongoose.model("OnwerKapat", onwerKapatSchema);

export default OnwerKapat;