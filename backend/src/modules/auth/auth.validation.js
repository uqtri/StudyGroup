import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .withMessage('Password must be 8+ chars with uppercase')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name required'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export const refreshValidation = [body('refreshToken').optional().isString()];
