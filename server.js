// import express
const express = require('express');
const mongodb = require('./data/database');
require('dotenv').config();

const app = express();

//Swagger setup for API documentation
const swaggerUIPath = require("swagger-ui-express");
const swaggerjsonFilePath = require("./swagger-output.json");
app.use("/api-docs", swaggerUIPath.serve, swaggerUIPath.setup(swaggerjsonFilePath));

app.use(express.json()); // For parsing application/json

// Routes setup
app.use('/', require('./routes')); // all routes are bundled in './routes'

// Set port
const port = process.env.PORT || 5500;

// Initialize MongoDB connection and start the server
console.log('MongoDB URI:', process.env.MONGODB_URI);
mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else{
        app.listen(port, () => {console.log(`Database is listening ${port}`)});
    }
});

