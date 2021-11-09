const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const sendMail = require('../../mail')
const jwt = require("jsonwebtoken");
const {upload,getFilePath,getFileUrl} = require('../../utils/common.js')

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
            .then(users => {
            res.send(users);
            }).catch(err => {
            res.status(500).send({
            message: err.message || "Something went wrong while getting list of users."
        });
    });
};
// Create and Save a new User
exports.create = async(req, res) => {


    // Our register logic starts here
  try {
    // Get user input
    const { name, password, email, otp } = req.body;

    console.log('body',req.body)
    // Validate user input
    if (!(email && name && password )) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
     const oldUser = await User.findOne({ email:email,is_verified:true});

    if (oldUser) {
      return res.status(409).send("User already exists please login");
    }

    //Check if Otp matches or not

    if(oldUser.otp != otp){
        return res.status(404).send("Invalid Otp");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.findByIdAndUpdate(oldUser._id,{
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      is_verified:true,
      is_active:true
    });

    if(!user){
        console.log('update failed')
        res.status(400).send(user);
    }


    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }

};


// Send otp mail to user

exports.sendOtpMail = async(req,res)=>{
    try{

    const {  email } = req.body;
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email:email});

    if(oldUser){
        return res.status(409).send("User Already Exist. Please Login");
    }

    const otp  = Math.floor(1000 + Math.random() * 9000);
    let body = `Please use the OTP: ${otp}`
    await sendMail.sendOtpEmail({to:email,body:body,subject:'Email Verification'})

    const user = await User.create({
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        otp:otp
      });

    return res.status(200).send("Otp sent successfully");

    }catch(err){
        console.log('err',err)
    }
}


// User Login 

exports.userLogin = async(req,res)=>{
    try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          return res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );

          // save user token
          user.token = token;
          // user
          return res.status(200).json({status:200,message:"login success",data:{token:user.token,email:user.email}});
        }
       return res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }
}


// Get user profile

exports.userProfile = async(req,res)=>{
    try {
        // Get user input
        const {user_id} = req.user
       
        // Validate if user exist in our database
        const user = await User.findOne({ _id:user_id });
    
        if (!user) {
          return res.status(400).send("Invalid token");     
        }
        user.profile= getFileUrl(req)+user.profile_pic
        return res.status(200)
               .json({status:200,message:"user profile retrieved successfully",data:{name:user.name,email:user.email,profile_img:user.profile}});
       
      } catch (err) {
        console.log(err);
      }
}


// Update user profile


exports.update = async(req, res) => {

  try {
    // Get user input
    const { name, profile_pic } = req.body;

    const {user_id} = req.user
    
    // check if user already exist
    // Validate if user exist in our database
    const user = await User.findOne({ _id:user_id });

    if (!user) {
      return res.status(409).send("User doesn't exist");
    }

    // update user in our database
    const updatedUser = await User.findByIdAndUpdate(user._id,{
      name,
      profile_pic
    });

    if(!updatedUser){
        console.log('update failed')
        res.status(400).send({status:400,message:'Update Failed',data:null});
    }

    // return updated success
    res.status(201).json({status:200,message:'Update Success',data:null});
  } catch (err) {
    console.log(err);
  }

};

// File upload 

exports.imageUpload = (req,res) =>{

  upload(req, res, (err) => {
    if(err) {
      res.status(400).send("Something went wrong!");
    }
    res.status(200).send({status:200,message:'File uploaded',data:req.file});
  });


}



