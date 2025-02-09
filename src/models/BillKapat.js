const mongoose = require('mongoose');
const Owner = require('./ownerModel');
const User = require('./userModel');

const userBillKapatSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  registerNo: {
    type: Number,
  },
  milktype:{
    type: String,
    required: true
  },
  orderData: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

userBillKapatSchema.pre("remove", async function (next) {
  console.log("Removing Milk:", this._id); // Log the Milk ID being removed
  try {
    const owners = await Owner.find({ ownerBillKapat: this._id });
    const user = await User.find({userBillKapat: this._id});
    console.log("Found owners with Milk reference:", owners.length);

    for (let owner of owners) {
      console.log("Removing Milk reference from Owner:", owner._id);
      await Owner.updateOne(
        { _id: owner._id },
        { $pull: { ownerBillKapat: this._id } }
      );
    }

    for(let u of user){ 
      await User.updateOne(
        { _id: u._id },
        { $pull: { userBillKapat: this._id } }
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});


const BillKapat = mongoose.models.BillKapat || mongoose.model("BillKapat", userBillKapatSchema);

export default BillKapat;