import mongoose from "mongoose";

const ExtraRateSchema = new mongoose.Schema({
    BuffRate: {
        type: String,
        required: true,
    },
    CowRate: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sangh",
        required: true,
    },
}, {timestamps: true});

const ExtraRate = mongoose.models.ExtraRate || mongoose.model("ExtraRate", ExtraRateSchema);
export default ExtraRate;
    