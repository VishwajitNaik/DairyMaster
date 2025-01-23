import mongoose from "mongoose";

const DefaultSNFSchema = new mongoose.Schema({
    snf: {
        type: Number,
        required: true
    },  
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.DefaultSNF || mongoose.model('DefaultSNF', DefaultSNFSchema);