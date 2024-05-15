const express = require('express')
const cors= require('cors')
const port = 3000
const path = require("path")
const bcrypt = require("bcrypt")
const User = require("./config")

const app = express()

//Convert data into json format

app.set('view engine', 'ejs')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// app.get('/home', (req, res) => {
//   // Handle the request for the home page here
//   res.send('Welcome to the home page');
// });

app.post("/signup",async(req, res)=>{
  try {
    const existingUser = await User.findOne({userName: req.body.userName})
    if(existingUser){
      res.json({exist: existingUser, message:"Username already existed."})
      return
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.passWord, saltRounds);
    
    const user = new User({
      userName: req.body.userName,
      passWord: hashedPassword
    });

    await user.save();
    res.status(201).json({success: true, messageSuccess: "Sign up successfull!"})
  } catch (err) {
      res.status(500).json({"status":err})
  }
})

app.post("/login",async(req, res)=>{
  try{
    const check = await User.findOne({userName: req.body.userName})
    if(!check){
      res.send("Username not found");
      return
    }

    const isPasswordMatch = await bcrypt.compare(req.body.passWord, check.passWord);
    if (isPasswordMatch) {
      // Assuming you have a user object that you want to send back upon successful login
      const user = { id: check._id, userName: check.userName }; // Modify this to include necessary user information
      res.status(200).json({ success: true, message: "Successfully logged in", user });
    } else {
      res.status(401).end();
    }
}catch (err) {
  res.status(500).json({ success: false, message: "Internal server error" });
}
})

  