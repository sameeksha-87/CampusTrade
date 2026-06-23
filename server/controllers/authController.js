const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Helper — signs a JWT for a given user id
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, roll_no, password } = req.body;
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 1. Basic validation
    if (!name || !email || !roll_no || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Verify college email domain
    const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+@iiitdmj\.ac\.in$/;
    if (!collegeEmailRegex.test(email)) {
      return res.status(400).json({
        message:
          "Only college email IDs ending with @iiitdmj.ac.in are allowed.",
      });
    }

    // Enforce strong password on register
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.",
      });
    }

    // 2. Check if email or roll_no already exists
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR roll_no = ?",
      [email, roll_no],
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Email or roll number already registered." });
    }

    // 3. Hash password  (salt rounds = 12 is a good balance of speed vs security)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Insert user
    const [result] = await pool.query(
      `
  INSERT INTO users
  (
    name,
    email,
    roll_no,
    password,
    verification_token
  )
  VALUES (?, ?, ?, ?, ?)
  `,
      [name, email, roll_no, hashedPassword, verificationToken],
    );

    const verifyLink = `http://localhost:5173/verify-email/${verificationToken}`;

    await sendEmail(
      email,
      "Verify your CampusTrade account",
      `Click here to verify your account:\n${verifyLink}`,
    );

    // 5. Return token
    const token = signToken(result.insertId);
    res.status(201).json({
      message:
        "Please check your email and verify your account.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const [rows] = await pool.query(
      `
      SELECT *
      FROM users
      WHERE verification_token = ?
      `,
      [token],
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const user = rows[0];

    await pool.query(
      `
      UPDATE users
      SET
        is_verified = TRUE,
        verification_token = NULL
      WHERE id = ?
      `,
      [user.id],
    );

    res.json({
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

//POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Verify college email domain
    const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+@iiitdmj\.ac\.in$/;
    if (!collegeEmailRegex.test(email)) {
      return res.status(400).json({
        message:
          "Only college email IDs ending with @iiitdmj.ac.in are allowed.",
      });
    }

    // 1. Find user
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.is_verified) {
      return res.status(401).json({
        message: "Please verify your email before logging in.",
      });
    }

    // 2. Check password  — same error message for both cases (security best practice)
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 3. Return token
    const token = signToken(user.id);
    res.status(200).json({
      message: "Logged in successfully.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roll_no: user.roll_no,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  try {
    // req.userId is set by the protect middleware
    const [rows] = await pool.query(
      "SELECT id, name, email, roll_no, created_at FROM users WHERE id = ?",
      [req.userId],
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = rows[0];

    const resetToken = crypto.randomBytes(32).toString("hex");

    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `
      UPDATE users
      SET
        reset_token = ?,
        reset_token_expiry = ?
      WHERE id = ?
      `,
      [resetToken, expiry, user.id],
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    await sendEmail(
      user.email,
      "CampusTrade Password Reset",
      `Reset your password:\n${resetLink}`,
    );

    res.json({
      message: "Password reset email sent",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const [rows] = await pool.query(
      `
      SELECT *
      FROM users
      WHERE reset_token = ?
      AND reset_token_expiry > NOW()
      `,
      [token],
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const user = rows[0];

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query(
      `
      UPDATE users
      SET
        password = ?,
        reset_token = NULL,
        reset_token_expiry = NULL
      WHERE id = ?
      `,
      [hashedPassword, user.id],
    );

    res.json({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;

    await pool.query("DELETE FROM wishlist WHERE user_id = ?", [userId]);

    await pool.query("DELETE FROM listings WHERE seller_id = ?", [userId]);

    await pool.query("DELETE FROM users WHERE id = ?", [userId]);

    res.json({
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const fs = require("fs");
const path = require("path");

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  deleteAccount,
  verifyEmail,
};
