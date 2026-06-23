import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res.data);
      if (res.data.images && res.data.images.length > 0) {
        setActiveImage(res.data.images[0].image_url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyEmail = () => {
    if (listing && listing.seller_email) {
      navigator.clipboard.writeText(listing.seller_email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!listing) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-muted)" }}>Loading listing details...</h2>
      </div>
    );
  }

  const isSold = listing.status === "sold";

  // Select a placeholder emoji/icon based on category
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Books": return "📚";
      case "Electronics": return "💻";
      case "Furniture": return "🛋️";
      default: return "📦";
    }
  };

  return (
    <div className="container" style={{ textAlign: "left", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="btn-outline"
        style={{
          padding: "8px 14px",
          fontSize: "0.85rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        ← Back to Browse
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Left Side: Image Gallery */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              width: "100%",
              height: "380px",
              backgroundColor: "var(--bg-main)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {activeImage ? (
              <img
                src={`http://localhost:5000/uploads/${activeImage}`}
                alt={listing.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div style={{ fontSize: "5rem" }}>{getCategoryIcon(listing.category)}</div>
            )}
          </div>

          {/* Image Thumbnails */}
          {listing.images && listing.images.length > 1 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {listing.images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setActiveImage(img.image_url)}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "var(--radius-sm)",
                    overflow: "hidden",
                    border: activeImage === img.image_url ? "2.5px solid var(--primary)" : "1px solid var(--border)",
                    cursor: "pointer",
                    backgroundColor: "var(--bg-main)",
                  }}
                >
                  <img
                    src={`http://localhost:5000/uploads/${img.image_url}`}
                    alt="Thumbnail"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Seller Info */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "0.75rem" }}>
              <span className="badge badge-orange">{listing.category}</span>
              <span className={`badge ${isSold ? "badge-red" : "badge-green"}`}>
                {listing.status}
              </span>
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "0 0 1rem 0", color: "var(--text-main)" }}>
              {listing.title}
            </h1>

            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "1rem 0" }}>
              <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--primary)" }}>
                ₹{Number(listing.price).toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>(Fixed Price)</span>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />

            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Description</h3>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text-main)", marginBottom: "2rem" }}>
              {listing.description || "No description provided for this listing."}
            </p>
          </div>

          {/* Seller Card Section */}
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
              backgroundColor: "var(--primary-light)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--primary-hover)", margin: 0 }}>
              Seller Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem" }}>
              <div>
                <strong style={{ color: "var(--text-muted)" }}>Name:</strong>{" "}
                <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{listing.seller_name || "N/A"}</span>
              </div>
              {listing.seller_roll_no && (
                <div>
                  <strong style={{ color: "var(--text-muted)" }}>Roll No:</strong>{" "}
                  <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{listing.seller_roll_no}</span>
                </div>
              )}
              <div>
                <strong style={{ color: "var(--text-muted)" }}>College Email:</strong>{" "}
                <span style={{ color: "var(--text-main)", fontWeight: 500, wordBreak: "break-all" }}>
                  {listing.seller_email || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;
