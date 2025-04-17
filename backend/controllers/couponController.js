import Coupon from '../models/couponsModel.js';
console.log("Coupon Schema Definition:", Coupon.schema.obj);
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

// helper function to generateUniqueCode
const generateUniqueCode = (length) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // available characters
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return `${code}`; // return the generated code
}

// helper function to save unique codes to a coupon
const generateAndAddCodes = async (couponId, quantity) => {

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
        throw new Error("Coupon not found");
    }

    // generate unique code function
    const newCodes = [];
    for (let i = 0; i < quantity; i++) {
        let code;
        do {
            code = generateUniqueCode(8); // generate a unique code of length 8
        } while (coupon.uniqueCodes.some(c => c.code === code));

        newCodes.push({
            code,
            isUsed: false,
            createdAt: new Date(),
            usedBy: null,
            usedAt: null
        });
    }
    // save new codes to the coupon
    coupon.uniqueCodes.push(...newCodes);
    await coupon.save();
    return newCodes; // return the generated codes
};

// get a random available coupon code from a coupon
const getACouponCode = async (req, res) => {
    try {
        const couponId = mongoose.Types.ObjectId.createFromHexString(req.params.couponId);

        // Just find an available code without updating anything
        const coupon = await Coupon.findOne({
            _id: couponId,
            disable: false,
            'uniqueCodes.isUsed': false,
            expiryDate: { $gt: new Date() }
        });

        if (!coupon) {
            return res.status(404).json({ error: "No available codes" });
        }

        // Get random available code
        const availableCodes = coupon.uniqueCodes.filter(c => !c.isUsed);
        const randomCode = availableCodes[Math.floor(Math.random() * availableCodes.length)];

        // Only return the code - no database updates
        res.status(200).json({
            code: randomCode.code,
        });

    } catch (error) {
        console.error("Error fetching coupon code:", error);
        res.status(500).json({ error: "Failed to get code" });
    }
};

// Redeem a coupon
const redeemCoupon = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { code, studentId } = req.body;
        const merchantId = req.user.uid;

        // Single atomic query to find and update the coupon
        const updatedCoupon = await Coupon.findOneAndUpdate(
            {
                merchant: merchantId,  // Validate merchant ownership
                'uniqueCodes.code': code,
                'uniqueCodes.isUsed': false,
                disable: false,
                expiryDate: { $gt: new Date() }
            },
            {
                $set: {
                    'uniqueCodes.$.isUsed': true,
                    'uniqueCodes.$.usedBy': studentId,
                    'uniqueCodes.$.usedAt': new Date()
                },
                $inc: { redeemedNum: 1 }
            },
            {
                new: true,
                session,
                runValidators: true
            }
        );

        if (!updatedCoupon) {
            await session.abortTransaction();
            return res.status(409).json({
                error: "Coupon redemption failed",
                details: "Code may be invalid, already used, or you're not authorized to redeem it"
            });
        }

        await session.commitTransaction();
        res.status(200).json({
            message: "Coupon redeemed successfully",
            coupon: updatedCoupon
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error redeeming coupon:", error);
        res.status(500).json({
            error: "Redemption failed",
            details: error.message
        });
    } finally {
        session.endSession();
    }
};

// Create a single coupon
const createCoupon = async (req, res) => {
    console.log("User from token:", req.user);
    console.log("Request body:", req.body);
    const { couponName, discount, discountType, description, termsConditions, category, totalNum, expiryDate, disable, disabledMessage } = req.body;

    // Validate input (400 - invalid data)
    if (!couponName || !discount || !description || !discountType || !termsConditions || !category || !totalNum || !expiryDate) {
        console.log("Validation failed - missing fields");
        return res.status(400).json({
            error: "Missing required fields",
            required: ["couponName", "discount", "description", "discountType", "termsConditions", "category", "totalNum", "expiryDate"]
        });
    }

    try {
        const merchant = req.user.uid;
        if (!req.user?.uid) {
            return res.status(401).json({ error: "Unauthorized - Missing merchant ID" });
        }
        console.log("Checking if coupon already exists:", couponName);

        // Check if a coupon with the same name already exists
        const existingCoupon = await Coupon.findOne({ couponName });
        if (existingCoupon) {
            return res.status(409).json({ error: "Coupon already exists" });
        }

        console.log("Creating coupon with totalNum:", totalNum);
        console.log("merchant:", merchant);

        const newCoupon = await Coupon.create({
            couponName,
            discount,
            description,
            discountType,
            merchant,
            termsConditions,
            category,
            totalNum,
            expiryDate,
            disable,
            disabledMessage
        });
        console.log("New coupon created (before codes):", {
            _id: newCoupon._id,
            hasUniqueCodes: Array.isArray(newCoupon.uniqueCodes),
            uniqueCodesCount: newCoupon.uniqueCodes?.length || 0
        });
        try {
            const generatedCodes = await generateAndAddCodes(newCoupon._id, totalNum); // generate and add unique codes to the coupon
            console.log(`Successfully generated ${generatedCodes.length} codes`);
        } catch (error) {
            console.error('Error generating codes:', error);
            throw new Error("Error generating codes");
        }

        const updatedCoupon = await Coupon.findById(newCoupon._id);
        console.log("Updated coupon with codes:", {
            uniqueCodesCount: updatedCoupon.uniqueCodes.length,
            sampleCode: updatedCoupon.uniqueCodes[0]?.code
        });

        // Return safe coupon data 
        res.status(201).json({
            id: updatedCoupon._id,
            couponName: updatedCoupon.couponName,
            discount: updatedCoupon.discount,
            description: updatedCoupon.description,
            discountType: updatedCoupon.discountType,
            category: updatedCoupon.category,
            merchant: updatedCoupon.merchant,
            createdAt: updatedCoupon.createdAt,
            disable: updatedCoupon.disable,
            uniqueCodes: updatedCoupon.uniqueCodes,
            totalNum: updatedCoupon.totalNum,
            redeemedNum: updatedCoupon.redeemedNum || 0,
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

// Get all coupons from all merchants
// Includes filters
const getAllCoupons = async (req, res) => {
    console.log('Received merchantId:', req.query.merchantId);
    try {
        const merchantId = req.user.uid; // From auth middleware
        const { disabled } = req.query;  // Optional disabled filter
        console.log("Merchant ID:", merchantId);

        if (!mongoose.Types.ObjectId.isValid(merchantId)) {
            return res.status(400).json({ error: "Invalid merchant ID" });
        }

        const filter = {
            merchant: merchantId
        };

        // filter by disabled
        //GET /api/coupons?disabled=true 
        // GET /api/coupons?disabled=false
        if (disabled !== undefined) {
            filter.disable = disabled === 'true';
        }

        console.log('Final filter being used:', filter);
        const allCoupons = await Coupon.find(filter).sort({ createdAt: -1 }); // Fetch all coupons from DB from most recent
        console.log('Number of coupons found:', allCoupons.length);
        res.status(200).json(allCoupons);
        console.log("First coupon codes:", allCoupons[0]?.uniqueCodes);
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

const toggleDisableCoupon = async (req, res) => {
    const { id } = req.params;
    const { disabledMessage } = req.body;
    console.log("[TOGGLE] Received message:", disabledMessage);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid couponId" });
    }

    try {
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({ error: "Coupon not found" });
        }

        const currentlyDisabled = coupon.disable; // store the current state

        // Toggle it
        coupon.disable = !currentlyDisabled;

        // Set or clear disabledMessage based on what you're doing
        if (currentlyDisabled) {

            coupon.disabledMessage = '';
        } else {
            // If it's currently enabled → you're disabling → save the message
            coupon.disabledMessage = disabledMessage || '';
        }

        await coupon.save();

        res.status(200).json({
            message: `Coupon ${coupon.disable ? 'disabled' : 'enabled'} successfully`,
            coupon,
        });
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

    const { id } = req.params;
    const { couponName, discount, description, discountType, termsConditions, category, totalNum: newTotalNum, expiryDate, disabledMessage } = req.body;

    try {
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        // update basic fields
        coupon.couponName = couponName || coupon.couponName;
        coupon.discount = discount || coupon.discount;
        coupon.description = description || coupon.description;
        coupon.discountType = discountType || coupon.discountType;
        coupon.termsConditions = termsConditions || coupon.termsConditions;
        coupon.category = category || coupon.category;
        coupon.expiryDate = expiryDate || coupon.expiryDate;
        // coupon.disable = req.body.disable !== undefined ? req.body.disable : coupon.disable; // toggle disable
        coupon.disable = false; // always set to false after editing
        coupon.disabledMessage = disabledMessage || coupon.disabledMessage; // update disabled message

        // update coupon number of codes
        // if user wants to change total code num
        const currentCodes = coupon.uniqueCodes;
        const currentCodeNum = currentCodes.length;
        const redeemedCodesNum = currentCodes.filter(c => c.isUsed).length;

        // if decrease code count < alr redeemed code count
        if (newTotalNum !== currentCodeNum) {
            if (newTotalNum < redeemedCodesNum) {
                return res.status(400).json({ message: `Cannot reduce total codes below ${redeemedCodesNum} (already redeemed codes)` });
            }

            // if decrease code count
            if (newTotalNum < currentCodeNum) {
                const unusedCodes = currentCodes.filter(c => !c.isUsed);
                const codesToRemove = currentCodeNum - newTotalNum;

                // dont remove used codes, just remove the number of unused codes needed to reduce code count 
                coupon.uniqueCodes = [
                    ...currentCodes.filter(c => c.isUsed),
                    ...unusedCodes.slice(0, unusedCodes.length - codesToRemove)
                ];
            }

            // if increase code count
            else if (newTotalNum > currentCodeNum) {
                const codesToAdd = newTotalNum - currentCodeNum;
                const newCodes = [];

                for (let i = 0; i < codesToAdd; i++) {
                    let code;
                    do {
                        code = generateUniqueCode(8);
                    } while (currentCodes.some(c => c.code === code));

                    newCodes.push({
                        code,
                        isUsed: false,
                        createdAt: new Date(),
                        usedBy: null,
                        usedAt: null
                    });
                }
                coupon.uniqueCodes.push(...newCodes);
            }
        }

        coupon.totalNum = newTotalNum; // update totalNum
        const updatedCoupon = await coupon.save(); // save the updated coupon

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

// Get all valid coupons OR redeemed coupons for a student based on query param
const getAllStudentCoupons = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { type } = req.query; // 'valid' or 'history'

        let query = {};

        if (type === 'valid') {
            // Get valid, unredeemed coupons
            query = {
                disable: false,
                $expr: { $lt: ["$redeemedNum", "$totalNum"] },
                expiryDate: { $gt: new Date() },
                'uniqueCodes': {
                    $not: {
                        $elemMatch: {
                            'usedBy': userId
                        }
                    }
                }
            };
        } else if (type === 'history') {
            // Get redeemed coupons
            query = {
                'uniqueCodes': {
                    $elemMatch: {
                        'usedBy': userId
                    }
                }
            };
        } else {
            return res.status(400).json({ 
                error: "Invalid type parameter. Use 'valid' or 'history'" 
            });
        }

        // Get coupons and populate merchant details then send it to user
        const coupons = await Coupon.find(query)
            .populate('merchant', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ 
            error: "Internal server error", 
            details: error.message 
        });
    }
};

const adminGetAllCoupons = async (req, res) => {
    try {
        const allCoupons = await Coupon.find({}).sort({ createdAt: -1 }); // Fetch all coupons from DB from most recent
        res.status(200).json(allCoupons);
        console.log("First coupon codes:", allCoupons[0]?.uniqueCodes);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

// Export the coupon handler methods to the routes page
export {
    createCoupon,
    getAllCoupons,
    getSingleCoupon,
    deleteCoupon,
    editCoupon,
    toggleDisableCoupon,
    redeemCoupon,
    getACouponCode,
    getAllStudentCoupons,
    adminGetAllCoupons
}; 