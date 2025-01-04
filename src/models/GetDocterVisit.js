const mongoose = require('mongoose');

const GetDocterVisitSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    Decises : {
        type: String,
        required: true
    },
    AnimalType : {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
    },
}, { timestamps: true });    

const GetDocterVisit = mongoose.models.GetDocterVisit || mongoose.model('GetDocterVisit', GetDocterVisitSchema);    

module.exports = GetDocterVisit;
    