import express from 'express';
import { createCoupon, getAllCoupons, getSingleCoupon, deleteCoupon, editCoupon, toggleDisableCoupon } from '../controllers/couponController.js';
import validateCoupon from '../controllers/validateCoupon.js';

const router = express.Router();

// Get all coupons
router.get('/', getAllCoupons);

// Get a single coupon
router.get('/:id', getSingleCoupon);

// create a single coupon
router.post('/', validateCoupon, createCoupon);

// delete a single coupon
router.delete('/:id', deleteCoupon);

//toggle disable coupon
router.patch('/:id/toggle', toggleDisableCoupon);


// edit a single coupon
router.patch('/:id', validateCoupon, editCoupon);

export default router;