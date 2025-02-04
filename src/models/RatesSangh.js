import mongoose from "mongoose";

const RatesSanghSchema = new mongoose.Schema(
  {
    HighFatB: {
      type: Number,
      required: true,
    },
    HighRateB: {
      type: Number,
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
      ref: "Sangh",
      required: true,
    },
  },
  { timestamps: true }
);

const RatesSangh =
  mongoose.models.RatesSangh || mongoose.model("RatesSangh", RatesSanghSchema);
export default RatesSangh;
