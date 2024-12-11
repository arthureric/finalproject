const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require(`mongodb`).MongoClient;


console.log('MONGODB_URI:', process.env.MONGODB_URI); 

let database;

const initDb = (callback) => {
    if (database) {
        console.log('DB is already inittialized!');
        return callback(null, database);
    }
    MongoClient.connect(process.env.MONGODB_URI)
    .then((client)=>{
        database = client;
        callback(null, database);
    })
    .catch((err) =>{
        callback(err);
    });
};

const getDatabase = () =>{
    if (!database){
        throw Error('Database not initialized')
    }
    return database;
};



module.exports = {initDb, getDatabase};