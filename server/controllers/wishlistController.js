const pool = require("../config/db");

const addToWishlist = async (req, res) => {
  try {
    const listingId = req.params.id;

    await pool.query(
      `
      INSERT INTO wishlist
      (user_id, listing_id)
      VALUES (?, ?)
      `,
      [
        req.userId,
        listingId
      ]
    );

    res.status(201).json({
      message: "Added to wishlist"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        l.*,
        u.name AS seller_name,
        (SELECT image_url FROM listing_images WHERE listing_id = l.id LIMIT 1) AS primary_image
      FROM wishlist w
      JOIN listings l ON w.listing_id = l.id
      JOIN users u ON l.seller_id = u.id
      WHERE w.user_id = ?
      `,
      [req.userId]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await pool.query(
      `
      DELETE FROM wishlist
      WHERE user_id = ?
      AND listing_id = ?
      `,
      [
        req.userId,
        req.params.id
      ]
    );

    res.json({
      message: "Removed from wishlist"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};