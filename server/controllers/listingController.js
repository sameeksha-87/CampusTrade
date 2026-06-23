const pool = require("../config/db");

// POST /api/listings
const createListing = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        message: "Title and price are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO listings
       (title, description, price, category, seller_id)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, price, category, req.userId],
    );

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.query(
          `
      INSERT INTO listing_images
      (listing_id, image_url)
      VALUES (?, ?)
      `,
          [result.insertId, file.filename],
        );
      }
    }

    res.status(201).json({
      message: "Listing created",
      listingId: result.insertId,
    });
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET /api/listings
const getListings = async (req, res) => {
  try {
    const { search, category, min_price, max_price, sort, status } = req.query;

    let query = `
      SELECT
        l.*,
        u.name AS seller_name,
        u.email AS seller_email,
        (SELECT image_url FROM listing_images WHERE listing_id = l.id LIMIT 1) AS primary_image
      FROM listings l
      JOIN users u
      ON l.seller_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += ` AND (l.title LIKE ? OR l.description LIKE ?) `;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ` AND l.category = ? `;
      params.push(category);
    }

    if (min_price) {
      query += ` AND l.price >= ? `;
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      query += ` AND l.price <= ? `;
      params.push(parseFloat(max_price));
    }

    // Default: only show available listings, unless requested otherwise
    if (status && status !== "all") {
      query += ` AND l.status = ? `;
      params.push(status);
    } else if (!status) {
      query += ` AND l.status = 'available' `;
    }

    // Sorting
    if (sort === "price_asc") {
      query += ` ORDER BY l.price ASC `;
    } else if (sort === "price_desc") {
      query += ` ORDER BY l.price DESC `;
    } else {
      query += ` ORDER BY l.created_at DESC `;
    }

    const [rows] = await pool.query(
      query,
      params
    );

    res.json(rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getListingById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, u.name AS seller_name, u.email AS seller_email, u.roll_no AS seller_roll_no
       FROM listings l
       JOIN users u ON l.seller_id = u.id
       WHERE l.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    const listing = rows[0];

    const [images] = await pool.query(
      `
      SELECT id, image_url
      FROM listing_images
      WHERE listing_id = ?
      `,
      [req.params.id],
    );

    listing.images = images;

    res.json(listing);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const [rows] = await pool.query("SELECT * FROM listings WHERE id = ?", [
      listingId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    const listing = rows[0];

    if (listing.seller_id !== req.userId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await pool.query("DELETE FROM listings WHERE id = ?", [listingId]);

    res.status(200).json({
      message: "Listing deleted successfully",
    });
  } catch (err) {
    console.error("Delete listing error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getMyListings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM listings
      WHERE seller_id = ?
      ORDER BY created_at DESC
      `,
      [req.userId],
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Get my listings error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const { title, description, price, category } = req.body;

    const [rows] = await pool.query("SELECT * FROM listings WHERE id = ?", [
      listingId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    const listing = rows[0];

    if (listing.seller_id !== req.userId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await pool.query(
      `
      UPDATE listings
      SET
        title = ?,
        description = ?,
        price = ?,
        category = ?
      WHERE id = ?
      `,
      [title, description, price, category, listingId],
    );

    res.status(200).json({
      message: "Listing updated successfully",
    });
  } catch (err) {
    console.error("Update listing error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const markAsSold = async (req, res) => {
  try {
    const listingId = req.params.id;

    const [rows] = await pool.query(
      "SELECT * FROM listings WHERE id = ?",
      [listingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }

    const listing = rows[0];

    if (listing.seller_id !== req.userId) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    await pool.query(
      `
      UPDATE listings
      SET status = 'sold'
      WHERE id = ?
      `,
      [listingId]
    );

    res.json({
      message: "Listing marked as sold"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;

    const [rows] = await pool.query(
      `
      SELECT *
      FROM listing_images
      WHERE id = ?
      `,
      [imageId]
    );

    if (!rows[0]) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    const image = rows[0];

    await pool.query(
      `
      DELETE FROM listing_images
      WHERE id = ?
      `,
      [imageId]
    );

    const imagePath = path.join(
      __dirname,
      "../uploads",
      image.image_url
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({
      message: "Image deleted",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const addImages = async (req, res) => {
  try {
    const listingId = req.params.id;

    for (const file of req.files) {
      await pool.query(
        `
        INSERT INTO listing_images
        (listing_id, image_url)
        VALUES (?, ?)
        `,
        [
          listingId,
          file.filename,
        ]
      );
    }

    res.json({
      message: "Images added",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createListing,
  getListings,
  getListingById,
  deleteListing,
  getMyListings,
  updateListing,
  markAsSold,
  addImages,
  deleteImage
};
