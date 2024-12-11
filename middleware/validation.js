const { body, validationResult } = require('express-validator');

// Combined error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();

};
// Validate user input for user
exports.validateUser = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required'),

  // Handle validation errors
  handleValidationErrors
];

// Validate role input
exports.validateRole = [
  body('roleName')
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ min: 3 })
    .withMessage('Role name must be at least 3 characters long'),
  
  body('permissions')
    .isArray({ min: 1 })
    .withMessage('Permissions must be an array with at least one permission'),

  // Handle validation errors
  handleValidationErrors
];
