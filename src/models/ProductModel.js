import mongoose from "mongoose";

const ProductNameSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true,
    },
    ProductNo: {
        type: Number,
        required: true,
    },
    ProductRate:{
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sangh",
        required: true,
    },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductNameSchema);
export default Product;
