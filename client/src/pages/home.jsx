import { useEffect, useState } from "react";
import api from "../services/api";
import ListingCard from "../components/ListingCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash,faEye, faSearch } from "@fortawesome/free-solid-svg-icons";


function Home() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [showSold, setShowSold] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [search, category, minPrice, maxPrice, sort, showSold]);

  const fetchListings = async () => {
    try {
      const statusParam = showSold ? "all" : "available";
      const res = await api.get(
        `/listings?search=${search}&category=${category}&min_price=${minPrice}&max_price=${maxPrice}&sort=${sort}&status=${statusParam}`
      );
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setShowSold(false);
  };

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Hero Section */}
      <div
        style={{
          background: " #f97316",
          borderRadius: "var(--radius-lg)",
          padding: "3rem 2rem",
          color: "#ffffff",
          textAlign: "left",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2, maxWidth: "600px" }}>
          <h1 style={{ color: "#ffffff", margin: "0 0 1rem 0", fontSize: "2.5rem", fontWeight: 800 }}>
            Buy & Sell anything on campus
          </h1>
          <p style={{ color: "#ffedd5", fontSize: "1.1rem", lineHeight: 1.5, margin: 0 }}>
            marketplace that helps you buy and sell books, electronics, furniture, and more from fellow students.
          </p>
        </div>
      </div>

      {/* Main Content Area: Sidebar + Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Sidebar Filters */}
        <aside
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            position: "sticky",
            top: "90px",
            boxShadow: "var(--shadow-sm)",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <span><FontAwesomeIcon icon={faSearch} /></span> Filters
            </h3>
            <button
              onClick={handleResetFilters}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Reset All
            </button>
          </div>

          {/* Search */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Keyword</label>
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Books">Books</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Price Range */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Price Range (₹)</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{ fontSize: "0.85rem" }}
              />
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ fontSize: "0.85rem" }}
              />
            </div>
          </div>

          {/* Sorting */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Latest Uploads</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Availability Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderTop: "1px solid var(--border)",
              paddingTop: "1rem",
              marginTop: "0.5rem"
            }}
          >
            <input
              type="checkbox"
              id="showSoldCheckbox"
              checked={showSold}
              onChange={(e) => setShowSold(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                accentColor: "var(--primary)",
                cursor: "pointer"
              }}
            />
            <label
              htmlFor="showSoldCheckbox"
              style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--text-main)",
                cursor: "pointer",
                userSelect: "none"
              }}
            >
              Include Sold Items
            </label>
          </div>
        </aside>

        {/* Listings Display Grid */}
        <main style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
              Showing <strong style={{ color: "var(--text-main)" }}>{listings.length}</strong> items
            </p>
          </div>

          {listings.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
                width: "100%",
              }}
            >
              {listings.map((listing) => (
                <div key={listing.id}>
                  <ListingCard listing={listing} />
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
              }}
            >
              <h3 style={{ fontSize: "1.25rem", color: "var(--text-main)" }}>No listings found</h3>
              <p style={{ color: "var(--text-muted)", maxWidth: "350px", fontSize: "0.9rem" }}>
                We couldn't find any items matching your selected filters. Try broadening your keywords or resetting filters.
              </p>
              <button onClick={handleResetFilters} className="btn-primary" style={{ marginTop: "0.5rem" }}>
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;