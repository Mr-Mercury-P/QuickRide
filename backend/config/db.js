const mongoose = require('mongoose');

require("dotenv").config();

const connectDB = async () => 
{
    try
    {
        await mongoose.connect(process.env.MONGOB_URL)
        .then(() =>
        {
            console.log("MongoDB Connection Successfull");
        })
    }
    catch(err)
    {
        console.log("Error while Connecting", err);
    }
}

module.exports = connectDB;