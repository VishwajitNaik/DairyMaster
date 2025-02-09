import mongoose from 'mongoose';
import Owner from './ownerModel';

const SthirKapatSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  KapatType: {
    type: String,
    enum: ['Kapat', 'Sthir Kapat'],
    required: true,
  },
  kapatCode: {
    type: Number,
    required: true,
  },
  kapatName: {
    type: String,
    required: true,
  },
  kapatRate: {
    type: Number,
    required: function () {
      return this.KapatType === 'Sthir Kapat';
    },
    validate: {
      validator: function (value) {
        // When KapatType is 'Sthir Kapat', kapatRate must be a positive number
        if (this.KapatType === 'Sthir Kapat') {
          return value > 0;
        }
        // When KapatType is 'Kapat', kapatRate should be undefined or null
        return value === undefined || value === null;
      },
      message: function (props) {
        if (this.KapatType === 'Sthir Kapat') {
          return 'kapatRate is required and must be a positive number for Sthir Kapat.';
        }
        return 'kapatRate must be undefined or null for Kapat.';
      },
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
  },
}, { timestamps: true });

// Add compound unique indexes for scoped uniqueness
SthirKapatSchema.index({ kapatCode: 1, createdBy: 1 }, { unique: true });
SthirKapatSchema.index({ kapatName: 1, createdBy: 1 }, { unique: true });

SthirKapatSchema.pre("remove", async function (next) {
  console.log("Removing Milk:", this._id); // Log the Milk ID being removed
  try {
    const owners = await Owner.find({ Kapat: this._id });
    console.log("Found owners with Milk reference:", owners.length);

    for (let owner of owners) {
      console.log("Removing Milk reference from Owner:", owner._id);
      await Owner.updateOne(
        { _id: owner._id },
        { $pull: { Kapat: this._id } }
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.Sthirkapat || mongoose.model('Sthirkapat', SthirKapatSchema);
