import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pass) => {
    let score = 0;

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[@$!%*?&]/.test(pass)) score++;

    if (score <= 2) {
      return {
        label: "Weak",
        color: "#ef4444",
      };
    }

    if (score <= 4) {
      return {
        label: "Medium",
        color: "#f59e0b",
      };
    }

    return {
      label: "Strong",
      color: "#22c55e",
    };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!strongPasswordRegex.test(password)) {
        alert(
          "Password must contain uppercase, lowercase, number and special character.",
        );
        return;
      }
      await api.post("/auth/reset-password", {
        token,
        password,
      });

      alert("Password reset successful");

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="container">
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
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
            }}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        </div>
        {password && (
          <div style={{ marginTop: "8px" }}>
            <span
              style={{
                color: strength.color,
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Strength: {strength.label}
            </span>

            <div
              style={{
                height: "6px",
                marginTop: "6px",
                borderRadius: "999px",
                background: "#333",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width:
                    strength.label === "Weak"
                      ? "33%"
                      : strength.label === "Medium"
                        ? "66%"
                        : "100%",
                  height: "100%",
                  background: strength.color,
                }}
              />
            </div>
          </div>
        )}

        <br />
        <br />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
