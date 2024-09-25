const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import jwt

// Registering the user
const createUser = async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullname: fullName,
      email: email,
      phone: phone,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User Created!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

// Login the user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  try {
    // Find the user by email
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist!" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = await jwt.sign(
      { id: existingUser._id, isAdmin: existingUser.role === "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Adding an expiration time for the token
    );

    // Respond with success message, token, and user info
    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error); // Debugging line
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

// get single user
const getSingleUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User found",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// update profile
const updateProfile = async (req, res) => {
  const id = req.user.id;
  const { fullname, email, phone, password } = req.body;
  if (!fullname || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.fullname = fullname;
    user.email = email;
    user.phone = phone;
    user.password = password;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getToken = async (req, res) => {
  const id = req.body.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.role === "admin" },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      success: true,
      message: "Token generated",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getSingleUser,
  updateProfile,
  getToken,
};
