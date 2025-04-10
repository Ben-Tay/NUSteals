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
    const { couponId } = req.params;
    const userId = req.user._id;

    try {
        const coupon = await Coupon.findOne({
            _id: couponId,
            totalNum: { $gt: 0 }, // ensure there are codes available
            disable: false, // ensure the coupon is not disabled
            'uniqueCodes.isUsed': false, // ensure there are unused codes
            expiryDate: { $gt: new Date() } // expirydate > current date
        });
        
        if (!coupon) {
            return res.status(404).json({ error: "Coupon not found or all  codes redeemed" });
        }

        // find all available codes
        const availableCodes = coupon.uniqueCodes.filter(c => !c.isUsed); // filter out used codes

        const randomCode = availableCodes[Math.floor(Math.random() * availableCodes.length)]; // get a random code from the available codes

        // TODO: atomically reserve this code for the user


        res.status(200).json({
            couponName: coupon.couponName,
            code: randomCode.code
        });
    } catch (error) {
        console.error("Error fetching coupon code:", error);
        res.status(500).json({ error: "Failed to retrieve coupon code", details: error.message });
    }
};

// Redeem a coupon
const redeemCoupon = async (req, res) => {
    const { code } = req.body; // code to redeem
    const userId = req.user._id;
    try {
        // find coupon using code
        const coupon = await Coupon.findOne({
            'uniqueCodes.code': code,           
        });
        if (!coupon) {
            return res.status(404).json({ error: "Coupon not found" });
        } 

        // find the specific code in the coupon's uniqueCodes array
        const couponCode = coupon.uniqueCodes.find(c => c.code === code);
        if (!couponCode) {
            return res.status(404).json({ error: "Code not found" });
        }

        if (couponCode.isUsed) {
            return res.status(400).json({ error: "Coupon already redeemed" });
        }

        if (coupon.expiryDate < new Date()) {
            return res.status(400).json({ error: "Coupon has expired" });
        } 

        if (coupon.disable) {
            return res.status(400).json({ error: "Coupon is disabled" });
        }

        // update coupon and code
        couponCode.isUsed = true;
        couponCode.usedBy = userId;
        couponCode.usedAt = new Date();

        coupon.totalNum -= 1; // decrement totalNum
        await coupon.save();
        // success response
        res.status(200).json({
            message: "Coupon redeemed successfully",
            coupon: {
                id: coupon._id,
                couponName: coupon.couponName,
                discount: coupon.discount,
                description: coupon.description,
                discountType: coupon.discountType,
                category: coupon.category,
                expiryDate: coupon.expiryDate,
                disable: coupon.disable,
                totalNum: coupon.totalNum
            }
        });
    } catch (error) {
        console.error("Error redeeming coupon:", error);
        res.status(500).json({ error: "Coupon redemption failed", details: error.message });
    }
};

// Create a single coupon
const createCoupon = async (req, res) => {
    console.log("Received create coupon request with body:", req.body);
    const { couponName, discount, discountType, description, termsConditions, category, totalNum, expiryDate, disable } = req.body;

    // Validate input (400 - invalid data)
    if (!couponName || !discount || !description || !discountType || !termsConditions || !category || !totalNum || !expiryDate) {
        console.log("Validation failed - missing fields");
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

        console.log("Creating coupon with totalNum:", totalNum);

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
            createdAt: updatedCoupon.createdAt,
            disable: updatedCoupon.disable,
            uniqueCodes: updatedCoupon.uniqueCodes, 
            totalNum: updatedCoupon.totalNum,
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

    const { id } = req.params;
    const { couponName, discount, description, discountType, termsConditions, category, totalNum: newTotalNum, expiryDate } = req.body;
    
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
                const unusedCodes = currentCodes.filter( c => !c.isUsed );
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


// Export the coupon handler methods to the routes page
export { createCoupon, getAllCoupons, getSingleCoupon, deleteCoupon, editCoupon, toggleDisableCoupon, redeemCoupon, getACouponCode }; 