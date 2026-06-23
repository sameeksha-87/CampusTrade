import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("available");
  const [listing, setListing] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    try {
      const res = await api.get(`/listings/${id}`);
      const listingData = res.data;
      setListing(listingData);
      setTitle(listingData.title);
      setDescription(listingData.description);
      setPrice(listingData.price);
      setCategory(listingData.category);
      setStatus(listingData.status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(e.target.files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/listings/${id}`, {
        title,
        description,
        price,
        category,
        status,
      });

      alert("Listing Updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }
    try {
      await api.delete(`/listings/${id}`);
      alert("Listing Deleted");
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  const uploadImages = async () => {
    if (newImages.length === 0) {
      alert("Please select images to upload first.");
      return;
    }
    try {
      const formData = new FormData();
      for (let i = 0; i < newImages.length; i++) {
        formData.append("images", newImages[i]);
      }

      await api.post(`/listings/${id}/images`, formData);
      alert("Images uploaded successfully!");
      setNewImages([]);
      setNewImagePreviews([]);
      fetchListing();
    } catch (err) {
      console.error(err);
      alert("Failed to upload new images");
    }
  };

  const deleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) {
      return;
    }
    try {
      await api.delete(`/listings/images/${imageId}`);
      fetchListing();
    } catch (err) {
      console.error(err);
    }
  };

  if (!listing) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-muted)" }}>Loading listing details...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "700px", margin: "0 auto", textAlign: "left" }}>
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
          Edit Listing
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Update details, manage photos, or mark your item as sold.
        </p>

        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>Product Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Price, Category, Status grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}>
            {/* Price */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Status */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Manage Existing Images */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Current Images</h3>
            {listing.images && listing.images.length > 0 ? (
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {listing.images.map((img) => (
                  <div
                    key={img.id}
                    style={{
                      position: "relative",
                      width: "120px",
                      height: "120px",
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-main)",
                    }}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${img.image_url}`}
                      alt="Listing"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => deleteImage(img.id)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "rgba(239, 68, 68, 0.9)",
                        color: "#ffffff",
                        border: "none",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        padding: 0,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                      title="Delete image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                No images uploaded. Add some below!
              </p>
            )}
          </div>

          {/* Add New Images */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Upload More Images</h3>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={uploadImages}
                style={{ whiteSpace: "nowrap", padding: "8px 16px" }}
              >
                Upload Now
              </button>
            </div>

            {/* New Image Previews */}
            {newImagePreviews.length > 0 && (
              <div style={{ display: "flex", gap: "10px", marginTop: "1rem", flexWrap: "wrap" }}>
                {newImagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <img
                      src={preview}
                      alt={`New Preview ${index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid var(--border)",
              paddingTop: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </button>
            </div>
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
              style={{ padding: "10px 16px" }}
            >
              🗑️ Delete Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditListing;
