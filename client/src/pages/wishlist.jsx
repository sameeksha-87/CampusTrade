import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartCirclePlus, } from "@fortawesome/free-solid-svg-icons";

function Wishlist() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeWishlist = async (e, listingId) => {
    e.stopPropagation(); // prevent navigation
    if (!window.confirm("Remove this item from your wishlist?")) {
      return;
    }
    try {
      await api.delete(`/wishlist/${listingId}`);
      fetchWishlist();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item.");
    }
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

  return (
    <div className="container" style={{ textAlign: "left" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        <FontAwesomeIcon 
        icon={ faHeart}
        style={{ color: "#ef4444", marginRight: "12px" }} /> My Wishlist
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "2.5rem" }}>
        Your saved items that you are interested in buying.
      </p>

      {items.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/listing/${item.id}`)}
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
                transition: "transform 0.2s, box-shadow 0.2s",
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
                  height: "170px",
                  backgroundColor: "var(--bg-main)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid var(--border)",
                  position: "relative",
                }}
              >
                {item.primary_image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${item.primary_image}`}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "3rem" }}>{getCategoryIcon(item.category)}</span>
                  </div>
                )}
                <span className="badge badge-orange" style={{ position: "absolute", bottom: "10px", left: "10px", fontSize: "0.7rem" }}>
                  {item.category}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: "1rem", display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "var(--text-main)",
                      margin: "0 0 0.5rem 0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      marginBottom: "1rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.4rem",
                    }}
                  >
                    {item.description || "No description provided."}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Price</span>
                      <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--primary)" }}>
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Seller</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text-main)" }}>
                        👤 {item.seller_name || "Student"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => removeWishlist(e, item.id)}
                    className="btn-danger"
                    style={{
                      width: "100%",
                      padding: "6px 12px",
                      fontSize: "0.8rem",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <span style={{ fontSize: "3.5rem" }}>❤️</span>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-main)" }}>Your wishlist is empty</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Explore listings and click the heart icon on any card to save it here.
          </p>
          <button onClick={() => navigate("/")} className="btn-primary" style={{ marginTop: "0.5rem" }}>
            Explore Listings
          </button>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
