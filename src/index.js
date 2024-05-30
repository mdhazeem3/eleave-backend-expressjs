const express = require('express')
const cors= require('cors')
const port = 3000
const path = require("path")
const bcrypt = require("bcrypt")
const {User, LeaveType} = require("./config")
// const Leave = require("./config")
const session = require('express-session');
const app = express()

//Convert data into json format

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your Angular frontend URL
  credentials: true, // Allow sending and receiving cookies from the frontend
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: 'asdasd', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/api/signup",async(req, res)=>{
  try {
    console.log(req.body)
    const existingUser = await User.findOne({email: req.body.email})
    if(existingUser){
      res.json({exist: existingUser, message:"Account already existed."})
      return
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phoneNo: req.body.phoneNo,
      password: hashedPassword,
      role: req.body.role
    });

    await user.save();
    res.status(201).json({success: true, messageSuccess: "Sign up successfull!"})
  } catch (err) {
      res.status(500).json({"status":err})
  }
})

app.post("/api/login",async(req, res)=>{
  try {
    const { email, password } = req.body;

    const check = await User.findOne({ email });
    if (!check) {
      return res.json({ status: false, message: 'Account not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, check.password);
    if (isPasswordMatch) {
      // Create a session and store user information
      req.session.userId = check._id;
      req.session.userEmail = check.email;
      req.session.userName = check.name;
      req.session.userRole = check.role;

      const user = {
        id: check._id,
        email: check.email,
        name: check.name,
        phoneNum: check.phoneNo,
        role: check.role,
      };

      res.cookie('sessionId', req.session.id, {
        httpOnly: true,
        secure: true,
        // Add other cookie options as needed (e.g., domain, path, expires)
      });

      return res.status(200).json({ success: true, session: req.session.id, message: 'Successfully logged in', user });
    } else {
      return res.json({ success: false, message: 'Incorrect password.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
},

app.post('/api/logout', async(req, res) => {
  // Check if the user is authenticated
  console.log(req.session.userId);
  if (!req.session.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Destroy the user session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      // Clear any additional user data stored in the session or cookies
      res.clearCookie('sessionId');

      return res.status(200).json({ message: 'Logout successful' });
    });
  } catch (err) {
    console.error('Error logging out:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}),

app.get('/api/profile', async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.session.userId) {
      return res.status(401).json({success: false, message: 'Unauthorized' });
    }

    // Find the user by their ID
    const checkUser = await User.findById(req.session.userId);

    if (!checkUser) {
      return res.status(404).json({success: false, message: 'User not found' });
    }

    const user ={
      name: checkUser.name,
      email: checkUser.email,
      phoneNo: checkUser.phoneNo
    }

    // Return the user profile data
    res.status(200).json({
      // id: user._id,
      success: true,
      user
      // Add any other user profile fields you need
    });
  } catch (err) {
    console.error('Error retrieving user profile:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}),

app.post('/api/getRole', async (req,res)=>{
  try{
    console.log(req.session.userId)
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      role: user.role
    });
  }catch(err){
    console.error('Error retrieving user profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}),

app.get('/api/users', async (req, res) => {
  try {
    const userList = await User.find();

    res.json(userList);
  } catch (err) {
    res.status(500).send(err);
  }
}),

app.get('/api/userById/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId);

    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
}),

app.get('/api/leavetype', async (req, res) =>{
  try{
    const leaveType = await LeaveType.find();
    console.log(leaveType)
    res.json(leaveType);
  }catch(err){
    res.status(500).send(err);
    console.log(err)
  }
}),

app.put('/api/user/leaves', async (req, res) => {


  const userId = req.body.userId;
  const leaveDetails = req.body.leaveDetails;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.leaves = leaveDetails;
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
})

)




  