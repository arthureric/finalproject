const mongodb = require('../data/database'); // MongoDB connection
const ObjectId = require('mongodb').ObjectId; // Import ObjectId
const createError = require('http-errors'); // Error handling

// Get all roles
exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await mongodb.getDatabase().db().collection('roles').find().toArray();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    next(createError(500, 'Failed to fetch roles'));
  }
};

// Get a specific role by ID
exports.getRoleById = async (req, res, next) => {
  const roleId = req.params.id;

  if (!ObjectId.isValid(roleId)) {
    return next(createError(400, 'Invalid role ID'));
  }

  try {
    const role = await mongodb.getDatabase().db().collection('roles').findOne({ _id: new ObjectId(roleId) });
    if (!role) return next(createError(404, 'Role not found'));
    res.status(200).json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    next(createError(500, 'Failed to fetch role'));
  }
};

// Create a new role
exports.createRole = async (req, res, next) => {
  const { roleName, permissions } = req.body;

  if (!roleName || !permissions) {
    return next(createError(400, 'Role name and permissions are required'));
  }

  const role = { roleName, permissions };

  try {
    const result = await mongodb.getDatabase().db().collection('roles').insertOne(role);
    res.status(201).json({ roleId: result.insertedId });
  } catch (error) {
    console.error('Error creating role:', error);
    next(createError(500, 'Failed to create role'));
  }
};

// Update a role by ID
exports.updateRole = async (req, res, next) => {
  const roleId = req.params.id;

  if (!ObjectId.isValid(roleId)) {
    return next(createError(400, 'Invalid role ID'));
  }

  try {
    const result = await mongodb.getDatabase().db().collection('roles').updateOne(
      { _id: new ObjectId(roleId) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return next(createError(404, 'Role not found'));
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to the role' });
    }

    res.status(200).json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    next(createError(500, 'Failed to update role'));
  }
};

// Delete a role by ID
exports.deleteRole = async (req, res, next) => {
  const roleId = req.params.id;

  if (!ObjectId.isValid(roleId)) {
    return next(createError(400, 'Invalid role ID'));
  }

  try {
    const result = await mongodb.getDatabase().db().collection('roles').deleteOne({ _id: new ObjectId(roleId) });

    if (result.deletedCount === 0) {
      return next(createError(404, 'Role not found'));
    }

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    next(createError(500, 'Failed to delete role'));
  }
};
