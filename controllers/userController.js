const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

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
      email,
      phone,
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

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Doesn't Exist!" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });
    }

    res.status(200).json({ success: true, message: "User Logged In!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

module.exports = {
  createUser,
  loginUser,
};
