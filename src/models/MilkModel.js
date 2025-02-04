const mongoose = require('mongoose');

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

const Milk = mongoose.models.Milk || mongoose.model('Milk', milkSchema);

module.exports = Milk;
