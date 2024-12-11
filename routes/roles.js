const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController'); // Adjust the path as necessary
const { validateRole } = require('../middleware/validation');
// Get all roles
router.get('/', rolesController.getAllRoles);

// Get a specific role
router.get('/:id', rolesController.getRoleById);

// Create a new role with validation
router.post('/', validateRole, rolesController.createRole);


// Update a role by ID with validation
router.put('/:id', validateRole, rolesController.updateRole);


// Delete a role by ID
router.delete('/:id', rolesController.deleteRole);

module.exports = router;
