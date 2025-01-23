// models/OrderModel.js

import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema({
  HighFatB: {
    type: String,
    required: true,
  },
  HighRateB: {
    type: String,
    required: true,
  },
  LowFatB: {
    type: String,
    required: true,
  },
  LowRateB: {
    type: String,
    required: true,
  },
  HighFatC: {
    type: String,
    required: true,
  },
  HighRateC: {
    type: String,
    required: true,
  },
  LowFatC: {
    type: String,
    required: true,
  },
  LowRateC: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Rate || mongoose.model('Rate', rateSchema);
