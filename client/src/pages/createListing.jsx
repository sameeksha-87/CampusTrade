import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateListing() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(e.target.files);

    // Create object URLs for previewing
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await api.post("/listings", formData);

      alert("Listing Created Successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create listing");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "650px", margin: "0 auto", textAlign: "left" }}>
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem 2rem",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Sell an Item
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Post your used items for sale. Provide accurate details and photos to help buyers make a decision.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>
              Product Title <span style={{ color: "var(--primary)" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. HC Verma Physics Vol 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>Description</label>
            <textarea
              placeholder="Describe condition, age, highlights, or where to meet up for delivery..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Price and Category grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Price */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>
                Price (₹) <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <input
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>
                Category <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>Product Images</label>
            <div
              style={{
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "var(--bg-main)",
                position: "relative",
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: "2rem" }}></span>
              <p style={{ fontSize: "0.85rem", fontWeight: 500, margin: "8px 0 0 0", color: "var(--text-main)" }}>
                Click to browse images
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                Upload up to 5 clear pictures
              </p>
            </div>

            {/* Image Preview Container */}
            {imagePreviews.length > 0 && (
              <div style={{ display: "flex", gap: "10px", marginTop: "1rem", flexWrap: "wrap" }}>
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--border)",
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div style={{ display: "flex", gap: "15px", marginTop: "1.5rem" }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Publish Listing
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate("/")}
              style={{ flex: 0.5 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;