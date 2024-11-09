const mongoose = require('mongoose');

const milkSchema = new mongoose.Schema({
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

const Milk = mongoose.models.Milk || mongoose.model('Milk', milkSchema);

module.exports = Milk;
