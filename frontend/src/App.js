import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
// 🆕 Import the new component for taking attendance
import TakeAttendance from "./pages/TakeAttendance"; 
import "./styles.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <h1>Smart Attendance</h1>
          </div>

          <nav>
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/add">Add Student</Link></li>
              {/* 🆕 Navigation link for the attendance page */}
              <li><Link to="/take-attendance">Mark Attendance</Link></li> 
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>Welcome, Admin</div>
            <div className="right">Today: {new Date().toLocaleDateString()}</div>
          </header>

          <section className="page-wrap">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddStudent />} />
              {/* 🆕 New route definition */}
              <Route path="/take-attendance" element={<TakeAttendance />} /> 
            </Routes>
          </section>
        </main>
      </div>
    </Router>
  );
}