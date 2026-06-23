import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Real-time password strength evaluator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "None", color: "#e7e5e4" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[@$!%*?&]/.test(pass)) score++;
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e) => {
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

    // Enforce strong password
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      alert(
        "Please choose a stronger password. It must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.",
      );
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        roll_no: rollNo,
        password,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Registration Failed! Please check if your details are correct.";
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
        padding: "2rem 1rem",
        backgroundColor: "var(--bg-main)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem 2.0rem",
          textAlign: "left",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
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
            Create your account to start buying and selling on campus
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Full Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-main)",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          {/* Roll Number */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-main)",
              }}
            >
              Roll Number
            </label>
            <input
              type="text"
              placeholder="e.g. 24bcs066"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
            />
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

            {/* Password strength meter */}
            {password && (
              <div style={{ marginTop: "6px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    Password Strength:
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  Use 8+ characters with uppercase, lowercase, numbers, &
                  symbols.
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Register
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--primary)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
