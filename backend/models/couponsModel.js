import mongoose from 'mongoose';
const { Schema } = mongoose; // Destructure Schema from mongoose


// Create schema
const couponSchema = new Schema({
    couponName: { type: String, required: true, unique: true },
    discount: { type: String, enum: ['flat', 'percentage'], require: true },
    description: { type: String, required: true },
    termsConditions: { type: String, required: true },
    category: { type: String, required: true },
    totalNum: { type: Number, required: true }, 
    expiryDate: { type: Date, required: true }, 
}, {
    timestamps: true,
});



// Create and export the model
const coupons = mongoose.model('coupons', couponSchema);
export default coupons;