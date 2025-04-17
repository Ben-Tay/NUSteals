import express from 'express';
import {
    createCoupon, getAllCoupons, getSingleCoupon, deleteCoupon, editCoupon, toggleDisableCoupon, redeemCoupon, getACouponCode, getAllValidCoupons, adminGetAllCoupons
} from '../controllers/couponController.js';
import { requireAuthJWT } from '../controllers/userController.js';
import validateCoupon from '../controllers/validateCoupon.js';

const router = express.Router();

// Admin get all coupons
router.get(
    '/',
    adminGetAllCoupons
);

// Get all coupons (includes filter)
router.get('/merchant', requireAuthJWT, getAllCoupons);

// Get all coupons for a specific user
router.get('/user/:userId', requireAuthJWT, getAllValidCoupons);

// Get a single coupon
router.get('/:id', getSingleCoupon);

// create a single coupon
router.post('/', requireAuthJWT, validateCoupon, createCoupon);

// delete a single coupon
router.delete('/:id', deleteCoupon);

//toggle disable coupon
router.patch('/:id/toggle', toggleDisableCoupon);

// get a coupon code
router.get('/:couponId/get-code', requireAuthJWT, getACouponCode);

// redeem a coupon
router.post('/redeem', requireAuthJWT, redeemCoupon);

// edit a single coupon
router.patch('/:id', validateCoupon, editCoupon);

export default router;