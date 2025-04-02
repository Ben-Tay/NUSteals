import mongoose from 'mongoose';
const { Schema } = mongoose; // Destructure Schema from mongoose


// Create schema
const couponSchema = new Schema({
    couponName: { type: String, required: true, unique: true },

    discountType: { type: String, enum: ['flat', 'percentage'], required: true },

    discount: { type: Number, required: true, min: 0 },

    description: { type: String, required: true },

    termsConditions: { type: String, required: true },
    
    category: { type: String, required: true },
    
    totalNum: { type: Number, required: true, min: 1 }, 
    
    expiryDate: { type: Date, required: true }, 
}, {
    timestamps: true,
});


// Create and export the model
const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;