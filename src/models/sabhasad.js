import mongoose from "mongoose";

const sabhasadSchema = new mongoose.Schema({
    registerNo: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    selectDairy: {
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
            validator: function(v) {
                return /^\d{10}$/.test(v); // Adjust regex based on your requirements
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    bankName: {
        type: String,
        required: true,
    },
    accountNo: {
        type: String, // Changed from Number to String
        required: true,
        unique: true,
    },
    aadharNo: {
        type: String, // Changed from Number to String
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v); // Adjust regex based on your requirements
            },
            message: props => `${props.value} is not a valid Aadhar number!`
        }
    },
    password: {
        type: String,
        required: true,
    },
    milkRecords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milk',
        default: [] // Ensure default value is an empty array
    }],
    userOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: []
    }],
    userAdvance: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advance',
        default: []
    }],
    userBillKapat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BillKapat',
        default: []
    }],
}, { timestamps: true });

// Remove the compound unique index on registerNo and createdBy
// sabhasadSchema.index({ registerNo: 1, createdBy: 1 }, { unique: true });

const Sabhasad = mongoose.models.Sabhasad || mongoose.model("Sabhasad", sabhasadSchema);

export default Sabhasad;
