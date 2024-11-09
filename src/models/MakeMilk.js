import mongoose from "mongoose";

const sanghAddMilk = new mongoose.Schema({
    registerNo: {
        type: Number,
        required: true,
    },
    sampleNo:{
      type: Number,
      required: true,
    },
    session: { 
      type: String,
      enum: ['morning', 'evening'],
      required: true 
    },
    dairyName: {
        type: String,
        required: true,
    },
    milkType: {
      type: String,
      required: true,
    },
    quality:{
        type: String,
        required: true,
    },
    milkKG:{
      type: Number,
      required: true,
    },
    milkLiter:{
      type: Number,
      required: true,
    },
    smelLiter:{
      type: Number,
    },
    fat:{
      type: Number,
      required: true,
    },
    snf:{
      type: Number,
      required: true,
    },
    rate:{
      type: Number,
      required: true,
    },
    amount:{
      type: Number,
      required: true,
    },
    senedCen:{
      type: Number,
      required: true,
    },
    acceptedCen:{
      type: Number,
      required: true,
    },
    smeledCen:{
      type: Number,
      required: true,
    },
    bhesalType:{
      type: String,
      required: true,
    },
    precotion:{
      type: String,
      required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
    date: { 
      type: Date,
      required: true, 
    },

}, { timestamps: true });

const Milkowner = mongoose.models.Milkowner || mongoose.model('Milkowner', sanghAddMilk);

export default Milkowner;
