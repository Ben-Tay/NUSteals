import { body, validationResult } from 'express-validator';

// Validation chain - for ensuring user pass in right stuff
const validateCoupon = [
  body('couponName')
    .notEmpty().withMessage('Coupon name is required')
    .isString().withMessage('Coupon name must be a worded text'),

  body('discountType')
    .notEmpty().withMessage('Discount type is required')
    .isIn(['flat', 'percentage']).withMessage('Discount type must be either "flat" or "percentage"'),

  body('discount') 
    .notEmpty().withMessage('Discount value is required')
    .isNumeric().withMessage('Discount value must be a number')
    .custom((value, { req }) => {
      if (req.body.discountType === 'percentage' && (value < 0 || value > 100)) {
        throw new Error('Percentage discount must be between 0 and 100');
      }
      if (req.body.discountType === 'flat' && value < 0) {
        throw new Error('Flat discount cannot be negative');
      }
      return true;
    }),

  body('description')
    .notEmpty().withMessage('Description is required'),

  body('termsConditions')
    .notEmpty().withMessage('Terms & Conditions is required'),

  body('category')
    .notEmpty().withMessage('Category is required'),

  body('totalNum')
    .isInt({ min: 1 }).notEmpty().withMessage('Number of coupons must be a positive integer'),

  body('expiryDate')
    .isISO8601().withMessage('Expiry Date must be a valid date (YYYY-MM-DD)')

];


export default validateCoupon;