import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    registerNo: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    milk: {
        type: String,
        required: true,
    },
    phone: {
        type: String, // Changed from Number to String
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Adjust regex based on your requirements
            },
            message: props => `${props.value} is not a valid phone number!`,
        },
    },
    bankName: {
        type: String,
        required: true,
    },
    accountNo: {
        type: String, // Changed from Number to String
        required: true,
    },
    aadharNo: {
        type: String, // Changed from Number to String
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{12}$/.test(v); // Adjust regex based on your requirements
            },
            message: props => `${props.value} is not a valid Aadhar number!`,
        },
    },
    password: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
    milkRecords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milk',
        default: [], // Ensure default value is an empty array
    }],
    userOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: [],
    }],
    userAdvance: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advance',
        default: [],
    }],
    userBillKapat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BillKapat',
        default: [],
    }],
    selectedKapat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sthirkapat',
    }], // Reference to Kapat
}, { timestamps: true });

userSchema.index({ registerNo: 1, createdBy: 1 }, { unique: true });


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
