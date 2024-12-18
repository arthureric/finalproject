const { MongoClient } = require('mongodb');
require('dotenv').config();
console.log('MongoDB URI:', process.env.MONGODB_URI); // Debugging step to ensure the URI is loaded


let database; // This will hold the database instance

const initDb = (callback) => {
  if (database) {
    console.log('Database is already initialized!');
    return callback(null, database);
  }

  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      database = client.db(); // Set the database instance
      console.log('Database connected successfully!');
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database; // Return the database instance
};

module.exports = { initDb, getDatabase };