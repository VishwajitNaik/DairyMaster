import mongoose from "mongoose";

const DeciesesSchema = new mongoose.Schema({
    Decieses: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sangh",
        required: true,
    },
}, { timestamps: true });

const Decieses = mongoose.models.Decieses || mongoose.model('Decieses', DeciesesSchema);
export default Decieses;