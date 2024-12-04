import mongoose from 'mongoose';

const OwnerKapatOptionSchema = new mongoose.Schema({
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
    ref: 'Sangh',
    required: true,
  },
}, { timestamps: true });

// Add compound unique indexes for scoped uniqueness
OwnerKapatOptionSchema.index({ kapatCode: 1, createdBy: 1 }, { unique: true });
OwnerKapatOptionSchema.index({ kapatName: 1, createdBy: 1 }, { unique: true });

export default mongoose.models.OwnerKapatOption || mongoose.model('OwnerKapatOption', OwnerKapatOptionSchema);
