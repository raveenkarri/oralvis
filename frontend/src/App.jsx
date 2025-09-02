import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TechnicianPage from "./pages/TechnicianPage";
import DentistPage from "./pages/DentistPage";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
  };

  const HomeRedirect = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) return <Navigate to="/login" replace />;
    if (role === "Technician") return <Navigate to="/technician" replace />;
    if (role === "Dentist") return <Navigate to="/dentist" replace />;

    return <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Home</Link>
        {!role && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {role && (
          <>
            {role === "Technician" && <Link to="/technician">Upload Scan</Link>}
            {role === "Dentist" && <Link to="/dentist">View Scans</Link>}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage onLogin={setRole} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route 
          path="/technician" 
          element={
            <ProtectedRoute roleRequired="Technician">
              <TechnicianPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dentist" 
          element={
            <ProtectedRoute roleRequired="Dentist">
              <DentistPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
