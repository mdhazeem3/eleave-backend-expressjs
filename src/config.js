const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const connect = mongoose.connect("mongodb://127.0.0.1:27017/Login");

//check database connection
connect.then(()=>{
    console.log("Database connected")
})
.catch(()=>{
    console.log("Database not connected")
});

//Login schema
const LoginSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true
    },
    passWord:{
        type: String,
        required: true
    }
});

const User = new mongoose.model("users", LoginSchema);

module.exports = User;