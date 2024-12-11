const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const createError = require('http-errors');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await mongodb.getDatabase().db().collection('users').find().toArray(); // Fetch all users from MongoDB
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    next(createError(500, error.message)); // Pass error to the error handler
  }
};

// Get a user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id); // Convert the ID to an ObjectId
    const user = await mongodb.getDatabase().db().collection('users').findOne({ _id: userId }); // Fetch user by ID

    if (!user) {
      return next(createError(404, 'User not found'));
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof ObjectId.InvalidObjectId) {
      return next(createError(400, 'Invalid user ID'));
    }
    next(createError(500, error.message)); // Pass error to the error handler
  }
};

// Create a new user
exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = {
    name,
    email,
    password,
  };
  
  try {
    const result = await mongodb.getDatabase().db().collection('users').insertOne(user); // Save the user to MongoDB
    res.status(201).json({ userId: result.insertedId }); // Return the ID of the newly created user
  } catch (error) {
    next(createError(400, error.message)); // Pass error to the error handler
  }
};

// Update a user by ID
exports.updateUser = async (req, res, next) => {
  const userId = new ObjectId(req.params.id); // Convert the ID to an ObjectId

  try {
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
    if (error instanceof ObjectId.InvalidObjectId) {
      return next(createError(400, 'Invalid user ID'));
    }
    next(createError(500, error.message)); // Pass error to the error handler
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res, next) => {
  const userId = new ObjectId(req.params.id); // Convert the ID to an ObjectId

  try {
    const result = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return next(createError(404, 'User not found'));
    }

    res.status(204).send(); // No content on success
  } catch (error) {
    if (error instanceof ObjectId.InvalidObjectId) {
      return next(createError(400, 'Invalid user ID'));
    }
    next(createError(500, error.message)); // Pass error to the error handler
  }
};
