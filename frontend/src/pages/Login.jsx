import React, { useState } from "react";

export default function Login({ setUser }) {
  const [password, setPassword] = useState("");

  const handleAdminLogin = () => {
    if (password === "admin123") {
      setUser({ role: "admin" });
    } else {
      alert("Wrong password");
    }
  };

  const handleStudent = () => {
    setUser({ role: "student" });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h1 style={styles.title}>Smart Attendance System</h1>
        <h2 style={styles.subtitle}>Admin Login</h2>

        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.loginBtn} onClick={handleAdminLogin}>
          Login
        </button>

        <div style={styles.divider}></div>

        <button style={styles.studentBtn} onClick={handleStudent}>
          Continue as Student
        </button>

      </div>
    </div>
  );
}

/* 🔥 STYLES */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #000000, #0f172a)",
    fontFamily: "Segoe UI, sans-serif",
  },

  card: {
    background: "#111827",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
    textAlign: "center",
    width: "350px",
  },

  title: {
    color: "#22c55e",
    marginBottom: "10px",
    fontSize: "26px",
    fontWeight: "bold",
  },

  subtitle: {
    color: "#e5e7eb",
    marginBottom: "25px",
    fontSize: "18px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "14px",
    outline: "none",
  },

  loginBtn: {
    width: "100%",
    padding: "12px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },

  divider: {
    height: "1px",
    background: "#374151",
    margin: "25px 0",
  },

  studentBtn: {
    width: "100%",
    padding: "10px",
    background: "transparent",
    border: "1px solid #22c55e",
    borderRadius: "8px",
    color: "#22c55e",
    cursor: "pointer",
  },
};