const express = require("express");
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword,deleteAccount,verifyEmail, } = require("../controllers/authController");
const protect = require("../middleware/protect");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);   // protect middleware runs first
router.post("/forgot-password",forgotPassword);
router.post(  "/reset-password",  resetPassword);
router.delete("/delete-account",protect,deleteAccount);
router.get("/verify-email/:token",verifyEmail);
module.exports = router;