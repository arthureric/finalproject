// Import required modules
const express = require('express');
const router = express.Router();

// Import user controller to handle logic for user operations
const usersController = require('../controllers/usersController');

// Import middleware for user validation
const { validateUser } = require('../middleware/validation');

/**
 * @route   GET /
 * @desc    Retrieve all users
 * @access  Public
 */
router.get('/', usersController.getAllUsers);

/**
 * @route   GET /:id
 * @desc    Retrieve a specific user by ID
 * @access  Public
 */
router.get('/:id', usersController.getUserById);

/**
 * @route   POST /
 * @desc    Create a new user
 * @access  Public
 * @middleware validateUser - Validates the user input
 */
router.post('/', validateUser, usersController.createUser);

/**
 * @route   PUT /:id
 * @desc    Update an existing user by ID
 * @access  Public
 * @middleware validateUser - Validates the user input
 */
router.put('/:id', validateUser, usersController.updateUser);

/**
 * @route   DELETE /:id
 * @desc    Delete a user by ID
 * @access  Public
 */
router.delete('/:id', usersController.deleteUser);

// Export the router for use in the main application
module.exports = router;