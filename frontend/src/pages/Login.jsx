import React, { useState } from "react";

export default function Login({ setUser }) {
  const [password, setPassword] = useState("");

  // 🔐 Admin login
  const handleAdminLogin = () => {
    if (password === "admin123") {
      setUser({ role: "admin" });   // ✅ HERE
    } else {
      alert("Wrong password");
    }
  };

  // 🎓 Student access
  const handleStudent = () => {
    setUser({ role: "student" });   // ✅ AND HERE
  };

  return (
  <div style={{ textAlign: "center", marginTop: 100 }}>
    
    {/* ✅ NEW HEADING */}
    <h1 style={{ marginBottom: 20 }}>Smart Attendance System</h1>

    <h2>Admin Login</h2>

    <input
      type="password"
      placeholder="Enter admin password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={{ padding: 10, margin: 10 }}
    />

    <br />

    <button onClick={handleAdminLogin}>Login</button>

    <hr style={{ margin: 30 }} />

    <button onClick={handleStudent}>
      Continue as Student
    </button>
  </div>
);
}