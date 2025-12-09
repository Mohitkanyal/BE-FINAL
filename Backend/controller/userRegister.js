// controller/userRegisterController.js
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

async function userRegisterController(req, res) {
  try {
    console.log("Register request body:", req.body);

    const { name, number, email, password } = req.body;

    if (!name || !number || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    // Check duplicate
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "User already exists!",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      number,
      email,
      password: hashPassword,
      role: "GENERAL",
    };

    const saveUser = await new userModel(payload).save();

    return res.status(201).json({
      data: {
        id: saveUser._id,
        name: saveUser.name,
        email: saveUser.email,
      },
      success: true,
      error: false,
      message: "User registered successfully!",
    });
  } catch (err) {
    console.error("Register backend error:", err);

    // handle duplicate key even if it slipped in
    if (err && err.code === 11000) {
      return res.status(409).json({
        message: "Duplicate field error",
        error: true,
        success: false,
        details: err.keyValue,
      });
    }

    return res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

module.exports = userRegisterController;
