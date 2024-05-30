const mongoose = require("mongoose");
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
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phoneNo:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    leaves: [
        {
          type: { type: String, required: true },
          total: { type: Number, required: true },
        },
      ]
});


//Leave Type Schema
const leaveTypeSchema = new mongoose.Schema({
    type: {
      type: String
    },
    total: {
      type: Number
    }
  });

const User = new mongoose.model("users", LoginSchema);
const LeaveType = new mongoose.model("leave-types", leaveTypeSchema);

module.exports = { User, LeaveType };
