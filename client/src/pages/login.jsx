import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Verify college email domain
    const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+@iiitdmj\.ac\.in$/;
    if (!collegeEmailRegex.test(email)) {
      setEmailError(
        "Only college email IDs ending with @iiitdmj.ac.in are allowed.",
      );
      return;
    }
    setEmailError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Login failed! Please check your credentials.";
      alert(msg);
    }
  };

  const isEmailSuffixValid = email === "" || email.endsWith("@iiitdmj.ac.in");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1rem",
        backgroundColor: "var(--bg-main)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem 2rem",
          textAlign: "left",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "3rem" }}></span>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginTop: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            Campus<span style={{ color: "var(--primary)" }}>Trade</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Sign in to start trading on your campus
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-main)",
              }}
            >
              College Email
            </label>
            <input
              type="email"
              placeholder="@iiitdmj.ac.in"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              required
              style={{
                borderColor: !isEmailSuffixValid ? "#ef4444" : "var(--border)",
              }}
            />
            {!isEmailSuffixValid && (
              <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>
                Must be an email ending with @iiitdmj.ac.in
              </span>
            )}
            {emailError && (
              <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>
                {emailError}
              </span>
            )}
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-main)",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: "45px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "1.1rem",
                  color: "var(--text-muted)",
                  zIndex: 5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </button>
            </div>
          </div>

          <div
            style={{
              textAlign: "right",
              marginTop: "-8px",
            }}
          >
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Login
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "var(--primary)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
