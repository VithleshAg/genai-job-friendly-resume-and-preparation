const mongoose = require('mongoose');

async function connectToDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch(error){
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectToDb;