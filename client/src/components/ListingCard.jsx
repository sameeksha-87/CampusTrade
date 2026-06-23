import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ListingCard({ listing }) {
  const navigate = useNavigate();

  const addToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post(`/wishlist/${listing.id}`);
      alert("Added to Wishlist!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to wishlist (already added or server error)");
    }
  };

  const handleCardClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  // Select a placeholder emoji/icon based on category
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Books": return "📚";
      case "Electronics": return "💻";
      case "Furniture": return "🛋️";
      default: return "📦";
    }
  };

  const isSold = listing.status === "sold";

  return (
    <div
      onClick={handleCardClick}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        backgroundColor: "var(--bg-card)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
        boxShadow: "var(--shadow-sm)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        height: "100%",
        opacity: isSold ? 0.75 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Product Image or Placeholder */}
      <div
        style={{
          height: "180px",
          backgroundColor: "var(--bg-main)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid var(--border)",
          overflow: "hidden"
        }}
      >
        {listing.primary_image ? (
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${listing.primary_image}`}
            alt={listing.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "3.5rem" }}>{getCategoryIcon(listing.category)}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              {listing.category}
            </span>
          </div>
        )}

        {/* Wishlist Heart Overlay */}
        <button
          onClick={addToWishlist}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "1.1rem",
            padding: 0,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            zIndex: 10,
            transition: "transform 0.1s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          ❤️
        </button>

        {/* Sold / Available Status Tag */}
        <span
          className={`badge ${isSold ? "badge-red" : "badge-orange"}`}
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            fontSize: "0.7rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          }}
        >
          {listing.status}
        </span>
      </div>

      {/* Product Details Info */}
      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              margin: 0,
              color: "var(--text-main)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {listing.title}
          </h3>
        </div>

        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            marginBottom: "0.75rem",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "2.4rem",
            margin: "0.25rem 0 0.75rem 0"
          }}
        >
          {listing.description || "No description provided."}
        </p>

        {/* Pricing and Seller details */}
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid var(--border)",
              paddingTop: "0.75rem",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Price</span>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>
                ₹{Number(listing.price).toLocaleString("en-IN")}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Seller</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-main)" }}>
                👤 {listing.seller_name || "Student"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
