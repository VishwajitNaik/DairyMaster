import mongoose from "mongoose";
import Owner from './ownerModel.js';

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
    
    ifscCode: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: "active",
        enum: ["active", "inactive"],
    },
    aadharNo: {
    type: String, // Keep it as a String to handle spaces
    required: true,
    validate: {
        validator: function (v) {
            const sanitizedValue = v.replace(/\s+/g, ""); // Remove all spaces
            return /^\d{12}$/.test(sanitizedValue); // Ensure exactly 12 digits after removing spaces
        },
        message: props => `${props.value} is not a valid Aadhar number!`,
    },
    set: v => v.replace(/\s+/g, ""), // Automatically remove spaces before saving to the database
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
    ucchal:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ucchal',
        default: []
    }],
}, { timestamps: true });

userSchema.index({ registerNo: 1, createdBy: 1 }, { unique: true });

userSchema.pre("remove", async function (next) {
    console.log("Removing Milk:", this._id); // Log the Milk ID being removed
    try {
      const owners = await Owner.find({ users: this._id });
      console.log("Found owners with Milk reference:", owners.length);
  
      for (let owner of owners) {
        console.log("Removing Milk reference from Owner:", owner._id);
        await Owner.updateOne(
          { _id: owner._id },
          { $pull: { users: this._id } }
        );
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });
  

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
