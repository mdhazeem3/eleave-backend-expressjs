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

//Leave Application Schema
const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', requried: true },
  appliedLeaveType: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: 'Pending' },
})

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
const leaveApplication = new mongoose.model("applied-leaves", LeaveSchema)

module.exports = { User, LeaveType, leaveApplication };
