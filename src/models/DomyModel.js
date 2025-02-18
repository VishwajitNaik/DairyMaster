// Model: models/DomyModel.js
import mongoose from "mongoose";

const DomySchema = new mongoose.Schema({
    Domy: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.Domy || mongoose.model('Domy', DomySchema);
