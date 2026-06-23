const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const upload = require("../middleware/upload");

const {
  createListing,
  getListings,
  getListingById,
  deleteListing,
  getMyListings,
  updateListing,
  markAsSold,
  addImages,
  deleteImage,
} = require("../controllers/listingController");

router.get("/", getListings);

router.get("/my", protect, getMyListings);

router.patch("/:id/sold",protect,markAsSold);

router.get("/:id", getListingById);

router.post("/",protect,upload.array("images", 5),createListing);

router.delete("/:id", protect, deleteListing);

router.put("/:id", protect, updateListing);

router.delete("/images/:imageId",protect,deleteImage);
router.post(
  "/:id/images",
  protect,
  upload.array("images", 5),
  addImages
);

module.exports = router;