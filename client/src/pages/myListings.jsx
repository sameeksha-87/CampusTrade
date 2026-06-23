import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyListings() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await api.get("/listings/my");
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }
    try {
      await api.delete(`/listings/${id}`);
      fetchMyListings();
    } catch (err) {
      console.error(err);
    }
  };

  const markSold = async (id) => {
    try {
      await api.patch(`/listings/${id}/sold`);
      fetchMyListings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>My Listings</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
            Manage the items you are selling.
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/create-listing")} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
          + Add New Listing
        </button>
      </div>

      {listings.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {listings.map((listing) => {
            const isSold = listing.status === "sold";
            return (
              <div
                key={listing.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-card)",
                  padding: "1.25rem",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                  opacity: isSold ? 0.75 : 1,
                  transition: "box-shadow 0.2s",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <span className="badge badge-orange" style={{ fontSize: "0.7rem" }}>{listing.category}</span>
                    <span className={`badge ${isSold ? "badge-red" : "badge-green"}`} style={{ fontSize: "0.7rem" }}>
                      {listing.status}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "var(--text-main)",
                      margin: "0.25rem 0 4px 0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {listing.title}
                  </h3>
                  <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--primary)", display: "block" }}>
                    ₹{Number(listing.price).toLocaleString("en-IN")}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => navigate(`/edit-listing/${listing.id}`)}
                      className="btn-outline"
                      style={{
                        flex: 1,
                        padding: "6px 12px",
                        fontSize: "0.8rem",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/listing/${listing.id}`)}
                      className="btn-secondary"
                      style={{
                        padding: "6px 12px",
                        fontSize: "0.8rem",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      View
                    </button>
                  </div>

                  {!isSold && (
                    <button
                      onClick={() => markSold(listing.id)}
                      className="btn-outline"
                      style={{
                        width: "100%",
                        padding: "6px 12px",
                        fontSize: "0.8rem",
                        borderRadius: "var(--radius-sm)",
                        color: "#065f46",
                        backgroundColor: "#d1fae5",
                        borderColor: "#a7f3d0",
                      }}
                    >
                      ✓ Mark Sold
                    </button>
                  )}

                  <button
                    onClick={() => deleteListing(listing.id)}
                    className="btn-danger"
                    style={{
                      width: "100%",
                      padding: "6px 12px",
                      fontSize: "0.8rem",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
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
          <span style={{ fontSize: "3.5rem" }}>📦</span>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-main)" }}>No listings found</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            You haven't posted any items for sale yet.
          </p>
          <button onClick={() => navigate("/create-listing")} className="btn-primary" style={{ marginTop: "0.5rem" }}>
            Add Your First Item
          </button>
        </div>
      )}
    </div>
  );
}

export default MyListings;