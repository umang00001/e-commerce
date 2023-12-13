const mongoose = require("mongoose");

const connectDb =async()=>{
    try {
        const connect = await mongoose.connect(process.env.URL);
        console.log(`connected to database ${connect.connection.host}`)
    } catch (error) {
            console.log(`error in mongodb ${error}`)
    }
}

module.exports =connectDb;