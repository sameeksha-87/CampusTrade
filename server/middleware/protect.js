const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // Expect header:  Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    const token = authHeader.split(" ")[1];

    // Verify — throws if expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId to request so controllers can use it
    req.userId = decoded.id;

    next();
  } catch (err) {
    // jwt.verify throws JsonWebTokenError or TokenExpiredError
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = protect;