import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderType: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Completed"], // Added "Completed" to the enum
        default: "Pending",
    },
    truckNo: { // New field for truck number
        type: String,
    },
    driverMobNo: { // New field for driver mobile number
        type: String,
    }
}, { timestamps: true });

const Orders = mongoose.models.Orders || mongoose.model('Orders', orderSchema);
export default Orders;
