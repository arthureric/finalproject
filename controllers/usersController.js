const mongodb = require('../data/database'); // MongoDB connection
const ObjectId = require('mongodb').ObjectId;
const createError = require('http-errors');

// Validate ObjectId before use
const validateObjectId = (id) => {
  if (!ObjectId.isValid(id)) {
    throw createError(400, 'Invalid user ID');
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await mongodb.getDatabase().db().collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    next(createError(500, 'Failed to fetch users: ' + error.message));
  }
};

// Get a user by ID
exports.getUserById = async (req, res, next) => {
  try {
    validateObjectId(req.params.id); // Validate ID
    const userId = new ObjectId(req.params.id);
    const user = await mongodb.getDatabase().db().collection('users').findOne({ _id: userId });

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (error) {
    next(error); // Pass proper errors to handler
  }
};

// Create a new user
exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return next(createError(400, 'Name, email, and password are required.'));
  }

  const user = {
    name,
    email,
    password,
  };

  try {
    const result = await mongodb.getDatabase().db().collection('users').insertOne(user);
    res.status(201).json({ userId: result.insertedId });
  } catch (error) {
    next(createError(500, 'Failed to create user: ' + error.message));
  }
};

// Update a user by ID
exports.updateUser = async (req, res, next) => {
  try {
    validateObjectId(req.params.id); // Validate ID
    const userId = new ObjectId(req.params.id);
    const updates = req.body;

    const result = await mongodb.getDatabase().db().collection('users').updateOne(
      { _id: userId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return next(createError(404, 'User not found'));
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res, next) => {
  try {
    validateObjectId(req.params.id); // Validate ID
    const userId = new ObjectId(req.params.id);

    const result = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return next(createError(404, 'User not found'));
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
