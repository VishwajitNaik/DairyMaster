// models/OrderModel.js
import mongoose from 'mongoose';
import Owner from './ownerModel'

const AdvanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  orderNo: {
    type: String,
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
  rakkam: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

AdvanceSchema.pre("remove", async function (next) {
  console.log("Removing Milk:", this._id); // Log the Milk ID being removed
  try {
    const owners = await Owner.find({ userAdvance: this._id });
    console.log("Found owners with Milk reference:", owners.length);

    for (let owner of owners) {
      console.log("Removing Milk reference from Owner:", owner._id);
      await Owner.updateOne(
        { _id: owner._id },
        { $pull: { userAdvance: this._id } }
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});


export default mongoose.models.Advance || mongoose.model('Advance', AdvanceSchema);
