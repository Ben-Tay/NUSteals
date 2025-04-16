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

    redeemedNum: { type: Number, default: 0 },

    expiryDate: { type: Date, required: true },

    disable: { type: Boolean, default: false },

    disabledMessage: { type: String, default: '' }, // Message to be sent to the user

    uniqueCodes: [{
        code: { type: String, unique: true },
        isUsed: { type: Boolean, default: false },
        usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // tracks user who used the coupon
        usedAt: { type: Date }
    }]
}, {
    timestamps: true,
});


// Create and export the model
const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;