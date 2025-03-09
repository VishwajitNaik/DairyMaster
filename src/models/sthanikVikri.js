import mongoose from "mongoose";
import Owner from "./ownerModel";

const sthanikVikriSchema = new mongoose.Schema({
  registerNo: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  milk: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },

  password: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
}, { timestamps: true });

sthanikVikriSchema.index({ registerNo: 1 }, { unique: true });

const SthanikVikri = mongoose.models.SthanikVikri || mongoose.model("SthanikVikri", sthanikVikriSchema);

export default SthanikVikri;
