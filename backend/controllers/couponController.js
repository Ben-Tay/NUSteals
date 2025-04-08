import Coupon from '../models/couponsModel.js';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

// Create a single coupon
const createCoupon = async (req, res) => {
    const { couponName, discount, discountType, description, termsConditions, category, totalNum, expiryDate, disable } = req.body;

    // Validate input (400 - invalid data)
    if (!couponName || !discount || !description || !discountType || !termsConditions || !category || !totalNum || !expiryDate) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["couponName", "discount", "description", "discountType", "termsConditions", "category", "totalNum", "expiryDate"]
        });
    }

    try {
        console.log("Checking if coupon already exists:", couponName);

        // Check if a coupon with the same name already exists
        const existingCoupon = await Coupon.findOne({ couponName });
        if (existingCoupon) {
            return res.status(409).json({ error: "Coupon already exists" });
        }

        console.log("Creating coupon:", { couponName, discount });

        const newCoupon = await Coupon.create({
            couponName,
            discount,
            description,
            discountType,
            termsConditions,
            category,
            totalNum,
            expiryDate,
            disable
        });

        // Return safe coupon data 
        res.status(201).json({
            id: newCoupon._id,
            couponName: newCoupon.couponName,
            discount: newCoupon.discount,
            description: newCoupon.description,
            discountType: newCoupon.discountType,
            category: newCoupon.category,
            createdAt: newCoupon.createdAt,
            disable: newCoupon.disable,
        });

    } catch (error) {
        console.error("Coupon creation failed:", error);
        res.status(500).json({
            error: "Coupon creation failed",
            details: error.message
        });
    }
};

// Get a single coupon
const getSingleCoupon = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid couponId" });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
    }
    res.status(200).json(coupon);

}

// Get all coupons
const getAllCoupons = async (req, res) => {
    try {
        const allCoupons = await Coupon.find({}).sort({ createdAt: -1 }); // Fetch all coupons from DB from most recent
        res.status(200).json(allCoupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

// Delete a coupon
const deleteCoupon = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid couponId" });
    }

    const deletedCoupon = await Coupon.findOneAndDelete({ _id: id });

    if (!deletedCoupon) {
        return res.status(404).json({ error: "Coupon not found" });
    }

    // Send response back to postman for verification
    res.status(200).json({ message: "Coupon deleted successfully", coupon: deletedCoupon })
}


// Disable a coupon (toggle)
const toggleDisableCoupon = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid couponId" });
    }

    try {
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({ error: "Coupon not found" });
        }

        // Toggle the isDisabled field
        coupon.disable = !coupon.disable;
        console.log("Toggling coupon status:", coupon.disable);
        await coupon.save();

        res.status(200).json({ message: `Coupon ${coupon.disable ? 'disabled' : 'enabled'} successfully`, coupon });
    } catch (error) {
        console.error("Error toggling coupon status:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// Edit a coupon
const editCoupon = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { couponName, discount, description, discountType, termsConditions, category, totalNum, expiryDate } = req.body;
    const { id } = req.params;

    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            { couponName, discount, description, discountType, termsConditions, category, totalNum, expiryDate },
            { new: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        // Send the updated coupon back
        res.status(200).json(updatedCoupon);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Export the coupon handler methods to the routes page
export { createCoupon, getAllCoupons, getSingleCoupon, deleteCoupon, editCoupon, toggleDisableCoupon }; 