import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/Register.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "Technician" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // <- Error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // reset error

    try {
      await axios.post(
        "https://oralvis-backend-jfma.onrender.com/api/auth/register",
        form
      );
      alert("Registration Successful! Redirecting to Login...");
      setForm({ email: "", password: "", role: "Technician" });
      navigate("/login");
    } catch (err) {
      // Show error if email is already registered
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-info">
        <h1>Join OralVis</h1>
        <p>
          OralVis helps dental professionals manage patient scans efficiently. 
          Sign up as a Technician to upload scans or as a Dentist to view detailed reports. 
          Secure, reliable, and easy to use.
        </p>
      </div>
      <div className="register-form-container">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="Technician">Technician</option>
            <option value="Dentist">Dentist</option>
          </select>

          {/* Error message */}
          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={error ? "btn-error" : ""}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="already-registered">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
