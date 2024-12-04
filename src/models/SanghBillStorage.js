import mongoose from 'mongoose';

const OwnerBillStorageSchema = new mongoose.Schema(
  {
    sanghId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Sangh', 
      required: true 
    }, // Reference to the Sangh
    ownerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Owner', 
      required: true 
    }, // Reference to the Owner
    registerNo: { 
      type: String, 
      required: true 
    }, // Owner register number
    ownerName: { 
      type: String, 
      required: true 
    }, // Owner name
    dateRange: { 
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true }
    }, // Start and end dates for the bill period
    milkData: {
      totalLiters: { type: Number, required: true },
      buffTotalLiters: { type: Number, required: true },
      buffTotalRakkam: { type: Number, required: true },
      cowTotalLiters: { type: Number, required: true },
      cowTotalRakkam: { type: Number, required: true },
    }, // Details about milk liters and payments
    extraRates: {
      totalBuffExtraRate: { type: Number, required: true },
      totalCowExtraRate: { type: Number, required: true },
      totalExtraRate: { type: Number, required: true, default: 0 },
    }, // Extra rates and total extra rates
    kapatDetails: {
      kapatRatePerLiter: { type: Number, required: true },
      totalKapatRateMultiplybyTotalLiter: { type: Number, required: true },
      totalKapat: { type: Number, required: true },
    }, // Kapat-related details
    totalRakkam: { type: Number, required: true }, // Total amount before deductions
    netPayment: { type: Number, required: true }, // Final payment after deductions
    createdAt: { type: Date, default: Date.now }, // Record creation time
  },
  { timestamps: true }
);

// Check if the model already exists before defining it
const OwnerBillStorage = mongoose.models.OwnerBillStorage || mongoose.model('OwnerBillStorage', OwnerBillStorageSchema);

export default OwnerBillStorage;
