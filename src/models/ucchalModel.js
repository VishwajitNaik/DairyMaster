import mongoose from "mongoose";

mongoose.set('bufferCommands', false); // ✅ Disable buffering

const UcchalSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // ✅ Use 'User' instead of 'Owner'
            required: true,
        },
        registerNo: {
            type: Number,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        rakkam: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// ✅ Create index in background to avoid blocking
UcchalSchema.index({ registerNo: 1 }, { background: true });

// ✅ Ensure the model is registered only once
const Ucchal = mongoose.models.Ucchal || mongoose.model('Ucchal', UcchalSchema);

export default Ucchal;
