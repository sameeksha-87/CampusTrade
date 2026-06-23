import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--bg-card)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "1.5rem", marginRight: "4px" }}></span>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>
          Campus<span style={{ color: "var(--primary)" }}>Trade</span>
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: location.pathname === "/" ? "var(--primary)" : "var(--text-main)",
            fontWeight: location.pathname === "/" ? 600 : 500,
            fontSize: "0.95rem",
            transition: "color 0.2s",
          }}
        >
          Browse
        </Link>

        <Link
          to="/create-listing"
          style={{
            textDecoration: "none",
            color: location.pathname === "/create-listing" ? "var(--primary)" : "var(--text-main)",
            fontWeight: location.pathname === "/create-listing" ? 600 : 500,
            fontSize: "0.95rem",
            transition: "color 0.2s",
          }}
        >
          Sell Item
        </Link>

        <Link
          to="/wishlist"
          style={{
            textDecoration: "none",
            color: location.pathname === "/wishlist" ? "var(--primary)" : "var(--text-main)",
            fontWeight: location.pathname === "/wishlist" ? 600 : 500,
            fontSize: "0.95rem",
            transition: "color 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
         Wishlist
        </Link>

        <Link
          to="/profile"
          style={{
            textDecoration: "none",
            color: location.pathname === "/profile" ? "var(--primary)" : "var(--text-main)",
            fontWeight: location.pathname === "/profile" ? 600 : 500,
            fontSize: "0.95rem",
            transition: "color 0.2s",
          }}
        >
          Profile
        </Link>

        <button
          onClick={handleLogout}
          className="btn-outline"
          style={{
            padding: "6px 14px",
            fontSize: "0.85rem",
            borderRadius: "var(--radius-sm)",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
