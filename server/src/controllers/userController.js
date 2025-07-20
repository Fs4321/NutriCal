const mongoose = require("mongoose");

const User = require("../models/userModel");

//const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcryptjs= require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

//register user
const registerUser = asyncHandler(async (req, res)=>{
    const {first_name,family_name,age,gender,height,weight, email_id, password,dietary_preference, is_admin = false,}= req.body;
    if (!first_name || !family_name || !email_id || !password) {
        res.status(400);
        throw new Error("First name, family name, email, and password are required.");
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email_id)) {
        res.status(400);
        throw new Error("Invalid email format (e.g., name@example.com)");
        }

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordPattern.test(password)) {
        res.status(400);
        throw new Error("Password must be at least 6 characters, include 1 letter and 1 number.");
        }

        if (!Number.isInteger(Number(age)) || Number(age) < 15) {
        res.status(400);
        throw new Error("Age must be above 15.");
        }

    
      if (!is_admin) {
        
        if (!age || !gender || !height || !weight || !dietary_preference) {
          res.status(400);
          throw new Error("All profile fields are required for regular users.");
        }
      }
    const alreadyUser = await User.findOne({email_id});
    if (alreadyUser){
        res.status(400);
        throw new Error ("User already registered");

    }

    //hash password
    const hashedPass = await bcryptjs.hash(password, 10);
    console.log("Hashed Password: ", hashedPass);
    const user = await User.create({
        first_name,family_name,age, gender, height,weight, email_id, password: hashedPass,
        dietary_preference,is_admin: req.body.is_admin === true || req.body.is_admin === "true",
    });
    console.log(`User created ${user}`);

    if (user){
        res.status(201).json({_id: user.id,email_id:user.email_id,is_admin: user.is_admin});
    }
    else{
        res.status(400);
        throw new Error("User Data is invalid")
    }
    
    //res.json ({message: "Register the User"});

});

//login user

const loginUser = asyncHandler(async (req, res)=>{
    const{email_id,password}= req.body;
    if(!email_id || !password){
        res.status(400);
        throw new Error("Fill up all the fields");

    }
    const user = await User.findOne({email_id});

    //compare password w/ hashedpassword
    if(user && (await bcryptjs.compare(password, user.password))){
        
        const accessToken = jwt.sign({
            user:{
                email_id:user.email_id,
                id: user.id,
                is_admin: user.is_admin
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "60m"}
    );
    res.status(200).json({accessToken});

    }
    else{
        res.status(401)
        throw new Error("email or password is not valid")
    }

});

//current User

const currentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("email_id is_admin first_name family_name age gender height weight dietary_preference");
  
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
  
    res.status(200).json(user);
  });
  

// UPDATE user
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json(updatedUser);
});

// DELETE user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
  
    await User.deleteOne({ _id: id });
  
    res.status(200).json({ message: "User deleted successfully" });
  });

  // GET all users (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const { page, limit } = req.paginate;

  
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || "first_name"; // default sort
  const order = req.query.order === "desc" ? -1 : 1;

  const query = {
    $or: [
      { first_name: { $regex: search, $options: "i" } },
      { family_name: { $regex: search, $options: "i" } },
      { email_id: { $regex: search, $options: "i" } },
    ],
  };

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("first_name family_name email_id is_admin")
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(total / limit);

  res
  .status(200)
  .links(generatePaginationLinks(req.originalUrl, page, totalPages, limit))
  .json({
    totalItems: total,
    totalPages,
    currentPage: page,
    users,
  });
  console.log(" Pagination received in controller:", req.paginate);

});

  

module.exports= {registerUser, loginUser, currentUser, updateUser, deleteUser,getAllUsers };