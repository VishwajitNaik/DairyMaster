// models/OrderModel.js

import mongoose from 'mongoose';
import Owner from "./ownerModel"
import User from "./userModel"

const OrderSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  milktype: {
    type: String,
    required: true,
  },
  kharediData: {
    type: String,
    required: true,
  },
  rakkam: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

OrderSchema.pre("remove", async function (next) {
  console.log("Removing Milk:", this._id); // Log the Milk ID being removed
  try {
    const owners = await Owner.find({ userOrders: this._id });
    const user = await User.find({userOrders: this._id});
    console.log("Found owners with Milk reference:", owners.length);

    for (let owner of owners) {
      console.log("Removing Milk reference from Owner:", owner._id);
      await Owner.updateOne(
        { _id: owner._id },
        { $pull: { userOrders: this._id } }
      );
    }

    for(let u of user){
      await User.updateOne(
        { _id: u._id },
        { $pull: { userOrders: this._id } }
      );
    }


    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
