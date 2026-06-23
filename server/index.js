require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const path = require("path");
const app = express();
const wishlistRoutes = require("./routes/wishlist");

//Middleware 
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/wishlist", wishlistRoutes);


//Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong." });
});


app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

//Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));