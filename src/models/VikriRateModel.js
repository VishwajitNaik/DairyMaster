import mongoose from "mongoose";

const VikriRateSchema = new mongoose.Schema({
    VikriRateBuff: {
        type: Number,
        required: true,
    },
    VikriRateCow: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
}, { timestamps: true });

const VikriRate = mongoose.models.VikriRate || mongoose.model("VikriRate", VikriRateSchema);
export default VikriRate;