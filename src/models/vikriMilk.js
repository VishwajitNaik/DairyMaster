const mongoose = require('mongoose')

const vikriMilkSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    session: {
        type: String,
        enum: ['morning', 'evening'],
        required: true
    },
    registerNo: {
        type: Number,
        required: true,
    },
    milk: {
        type: String,
        required: true,
    },
    liter: {
        type: Number,
        required: true,
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
        ref: 'SthanikVikri' 
      },

}, { timestamps: true });

const VikriMilk = mongoose.models.VikriMilk || mongoose.model('VikriMilk', vikriMilkSchema);
module.exports = VikriMilk