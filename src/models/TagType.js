import mongoose from "mongoose";

const TagTypeSchema = new mongoose.Schema({
    TagType: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sangh",
        required: true,
    },
}, { timestamps: true });

const TagType = mongoose.models.TagType || mongoose.model('TagType', TagTypeSchema);
export default TagType;