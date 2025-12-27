const { body, validationResult } = require('express-validator');

// Validation rules
const registerValidation = [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
];

const jobValidation = [
    body('title', 'Job title is required').not().isEmpty(),
    body('max_positions', 'Max positions must be a number').isNumeric(),
    body('salary_per_month', 'Salary must be a number').isNumeric()
];

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    registerValidation,
    loginValidation,
    jobValidation,
    validate
};
