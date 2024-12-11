const mongodb = require('../data/database'); // import your MongoDB connection
const ObjectId = require('mongodb').ObjectId; // Import ObjectId for ID manipulation
const createError = require('http-errors'); // Importing createError for better error handling

// Get all roles
exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await mongodb.getDatabase().db().collection('roles').find().toArray(); // Fetch all roles from MongoDB
    res.status(200).json(roles);
  } catch (error) {
    next(createError(500, error.message)); // Pass error to the error handler
  }
};

// Get a specific role by ID
exports.getRoleById = async (req, res, next) => {
  try {
    const roleId = new ObjectId(req.params.id); // Create ObjectId
    const role = await mongodb.getDatabase().db().collection('roles').findOne({ _id: roleId });
    if (!role) return next(createError(404, 'Role not found')); // Using createError for consistency
    res.status(200).json(role);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Invalid ObjectId')) {
      return next(createError(400, 'Invalid role ID')); // Handle invalid ID format
    }
    next(createError(500, error.message)); // Pass error to the error handler
  }
};

// Create a new role
exports.createRole = async (req, res, next) => {
  const { roleName, permissions } = req.body;

  // Input validation
  if (!roleName || !permissions) {
    return next(createError(400, 'Role name and permissions are required')); // Input validation error
  }

  const role = {
    roleName,
    permissions,
  };

  try {
    const result = await mongodb.getDatabase().db().collection('roles').insertOne(role); // Save the role to MongoDB
    res.status(201).json({ roleId: result.insertedId }); // Return the ID of the newly created role
  } catch (error) {
    next(createError(400, error.message)); // Pass error to the error handler
  }
};

// Update a role by ID
exports.updateRole = async (req, res, next) => {
  try {
    const roleId = new ObjectId(req.params.id); // Create ObjectId
    const updates = req.body;

    const result = await mongodb.getDatabase().db().collection('roles').updateOne(
      { _id: roleId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return next(createError(404, 'Role not found')); // Using createError for consistency
    }

    res.status(200).json({ message: 'Role updated successfully' });
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Invalid ObjectId')) {
      return next(createError(400, 'Invalid role ID')); // Handle invalid ID format
    }
    next(createError(500, error.message)); // Pass error to the error handler
  }
};

// Delete a role by ID
exports.deleteRole = async (req, res, next) => {
  try {
    const roleId = new ObjectId(req.params.id); // Create ObjectId

    const result = await mongodb.getDatabase().db().collection('roles').deleteOne({ _id: roleId });
    if (result.deletedCount === 0) {
      return next(createError(404, 'Role not found')); // Using createError for consistency
    }

    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Invalid ObjectId')) {
      return next(createError(400, 'Invalid role ID')); // Handle invalid ID format
    }
    next(createError(500, error.message)); // Pass error to the error handler
  }
};
