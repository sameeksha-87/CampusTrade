const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

router.post("/:id", protect, addToWishlist);

router.get("/", protect, getWishlist);

router.delete("/:id", protect, removeFromWishlist);

module.exports = router;