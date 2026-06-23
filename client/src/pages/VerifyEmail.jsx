import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function VerifyEmail() {
  const { token } = useParams();

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    try {
      await api.get(
        `/auth/verify-email/${token}`
      );

      alert("Email verified!");

      window.location.href = "/login";
    } catch (err) {
      alert("Invalid verification link");
    }
  };

  return <h2>Verifying...</h2>;
}

export default VerifyEmail;