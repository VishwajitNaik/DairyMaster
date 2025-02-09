const mongoose = require('mongoose');
import Owner from './ownerModel.js';
import User from "./userModel.js"

const milkSchema = new mongoose.Schema({
  registerNo: {
    type: Number,
    required: true,
  },
  session: { 
    type: String,
    enum: ['morning', 'evening'],
    required: true 
  },
  milk: {
    type: String,
    required: true,
  },
  liter: { 
    type: Number, 
    required: true 
  },
  fat: { 
    type: Number, 
    required: true 
  },
  snf:{
    type: Number, 
    required: true 
  },
  dar: { 
    type: Number, 
    required: true 
  },
  rakkam: { 
    type: Number, 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  date: { 
    type: Date,
    required: true, 
  }
});

// Add an index for fast searching by registerNo, session, and date
milkSchema.index({ registerNo: 1, session: 1, date: 1 });

// Add an index for fast searching by createdBy and date
milkSchema.index({ createdBy: 1, date: 1 });

// Add an index for fast searching by registerNo and session
milkSchema.index({ registerNo: 1, session: 1 });


milkSchema.pre("remove", async function (next) {
  console.log("Removing Milk:", this._id); // Log the Milk ID being removed
  try {
    const owners = await Owner.find({ userMilk: this._id });
    const user = await User.find({milkRecords: this._id});
    console.log("Found owners with Milk reference:", owners.length);

    for (let owner of owners) {
      console.log("Removing Milk reference from Owner:", owner._id);
      await Owner.updateOne(
        { _id: owner._id }, 
        { $pull: { userMilk: this._id } }
      );
    }

    for(let u of user){
      await User.updateOne(
        { _id: u._id }, 
        { $pull: { milkRecords: this._id } }
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});


const Milk = mongoose.models.Milk || mongoose.model('Milk', milkSchema);

module.exports = Milk;
