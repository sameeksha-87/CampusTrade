import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const navigate = useNavigate();

  const fetchMyListings = async () => {
    try {
      const res = await api.get("/listings/my");
      setMyListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account and all your listings.",
    );

    if (!confirmDelete) return;

    try {
      await api.delete("/auth/delete-account");

      localStorage.removeItem("token");

      alert("Account deleted successfully");

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyListings();
  }, []);

  if (!user) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-muted)" }}>Loading profile...</h2>
      </div>
    );
  }

  // Get initial letters of name for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container" style={{ textAlign: "left" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2.5fr",
          gap: "2.5rem",
          alignItems: "start",
        }}
      >
        {/* Left Side: Profile Details Card */}
        <aside
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem 1.5rem",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.5rem",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: 700,
            }}
          >
            {getInitials(user.name)}
          </div>

          <div>
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                margin: "0 0 4px 0",
              }}
            >
              {user.name}
            </h2>
          </div>

          <hr
            style={{
              width: "100%",
              border: 0,
              borderTop: "1px solid var(--border)",
            }}
          />

          {/* User Fields */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              textAlign: "left",
              fontSize: "0.9rem",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Email
              </span>
              <span
                style={{
                  color: "var(--text-main)",
                  fontWeight: 500,
                  wordBreak: "break-all",
                }}
              >
                {user.email}
              </span>
            </div>

            <div>
              <span
                style={{
                  display: "block",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Roll Number
              </span>
              <span style={{ color: "var(--text-main)", fontWeight: 500 }}>
                {user.roll_no}
              </span>
            </div>

            <div>
              <span
                style={{
                  display: "block",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Account Created
              </span>
              <span style={{ color: "var(--text-main)", fontWeight: 500 }}>
                {new Date(user.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <hr
            style={{
              width: "100%",
              border: 0,
              borderTop: "1px solid var(--border)",
            }}
          />

          <div style={{ width: "100%" }}>
            <button
              onClick={handleDeleteAccount}
              style={{
                width: "100%",
                padding: "10px",
                border: "none",
                borderRadius: "8px",
                background: "var(--primary)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Delete Account
            </button>
          </div>
        </aside>

        {/* Right Side: Manage Listings */}
        <main>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
              My Listed Items
            </h2>
            <button
              className="btn-primary"
              onClick={() => navigate("/create-listing")}
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              + Sell New Item
            </button>
          </div>

          {myListings.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {myListings.map((listing) => {
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
                      position: "relative",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span
                          className="badge badge-orange"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {listing.category}
                        </span>
                        <span
                          className={`badge ${isSold ? "badge-red" : "badge-green"}`}
                          style={{ fontSize: "0.7rem" }}
                        >
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
                      <span
                        style={{
                          fontSize: "1.15rem",
                          fontWeight: 700,
                          color: "var(--primary)",
                          display: "block",
                        }}
                      >
                        ₹{Number(listing.price).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        borderTop: "1px solid var(--border)",
                        paddingTop: "0.75rem",
                      }}
                    >
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
                        ✏️ Edit Listing
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
              }}
            >
              <span style={{ fontSize: "3.5rem" }}>📦</span>
              <h3 style={{ fontSize: "1.25rem", color: "var(--text-main)" }}>
                You haven't listed any items
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  maxWidth: "300px",
                }}
              >
                Got something to sell?
                <br></br>list it here!
              </p>
              <button
                onClick={() => navigate("/create-listing")}
                className="btn-primary"
                style={{ marginTop: "0.5rem" }}
              >
                Start Selling
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;
