const mongoose = require('mongoose');
const Owner = require('./ownerModel');
const User = require('./userModel');

const userBillKapatSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    registerNo: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not a valid register number'
      }
    },
    milktype: {
      type: String,
      required: true,
      trim: true
    },
    orderData: {
      type: String,
      required: true,
      trim: true
    },
    rate: {
      type: Number,
      required: true,
      min: [0, 'Rate cannot be negative']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false // Removes the __v field
  }
);

// ✅ Indexing for faster query performance
userBillKapatSchema.index({ createdBy: 1 });
userBillKapatSchema.index({ username: 1 });
userBillKapatSchema.index({ date: 1 });
userBillKapatSchema.index({ registerNo: 1 });

// ✅ Pre-hook with Promise.all() and timeout handling
userBillKapatSchema.pre('remove', async function (next) {
  console.log('Removing BillKapat:', this._id);

  // Create a timeout handler (10 seconds)
  const timeout = setTimeout(() => {
    console.error('Timeout reached, stopping execution...');
    next(new Error('Operation timed out'));
  }, 10000);

  try {
    // Fetch related owners and users concurrently
    const [owners, users] = await Promise.all([
      Owner.find({ ownerBillKapat: this._id }).select('_id'),
      User.find({ userBillKapat: this._id }).select('_id')
    ]);

    console.log('Found owners:', owners.length);
    console.log('Found users:', users.length);

    // Update related records concurrently
    await Promise.all([
      ...owners.map(owner =>
        Owner.updateOne(
          { _id: owner._id },
          { $pull: { ownerBillKapat: this._id } }
        )
      ),
      ...users.map(user =>
        User.updateOne(
          { _id: user._id },
          { $pull: { userBillKapat: this._id } }
        )
      )
    ]);

    console.log('BillKapat references removed successfully');

    clearTimeout(timeout);
    next();
  } catch (error) {
    clearTimeout(timeout);
    console.error('Error removing BillKapat:', error);
    next(error);
  }
});

// ✅ Model definition
const BillKapat = mongoose.models.BillKapat || mongoose.model('BillKapat', userBillKapatSchema);

module.exports = BillKapat;
