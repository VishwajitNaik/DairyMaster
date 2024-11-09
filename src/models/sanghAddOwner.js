import mongoose from "mongoose";

const SanghAddOnwerSchema = new mongoose.Schema({
    registerNo: {
        type: Number,
        required: true,
    },
    DairyName: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sangh",
        required: true,
    },
}, { timestamps: true });

const SanghOnwer = mongoose.models.SanghOnwer || mongoose.model('SanghOnwer', SanghAddOnwerSchema);

export default SanghOnwer;
