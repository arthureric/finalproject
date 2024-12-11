const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { validateUser } = require('../middleware/validation');
// Get all users
router.get('/', usersController.getAllUsers);

// Get a specific user by ID
router.get('/:id', usersController.getUserById);

// Create a new user with validation
router.post('/', validateUser, usersController.createUser);

// Update a user by ID with validation
router.put('/:id', validateUser, usersController.updateUser);

// Delete a user by ID
router.delete('/:id', usersController.deleteUser);


module.exports = router;
