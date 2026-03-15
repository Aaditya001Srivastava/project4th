// Filename: App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Existing pages
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import TakeAttendance from "./pages/TakeAttendance";

// New pages
import AttendanceLog from "./pages/AttendanceLog";
import StudentAttendance from "./pages/StudentAttendance";

import "./styles.css";

export default function App() {
  return (
    <Router>
      <div className="app">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="brand">
            <h1>Smart Attendance</h1>
          </div>

          <nav>
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/add">Add Student</Link></li>
              <li><Link to="/take-attendance">Mark Attendance</Link></li>

              {/* NEW BUTTONS */}
              <li><Link to="/attendance-log">Attendance Log</Link></li>
              <li><Link to="/student-attendance">Student Attendance</Link></li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="main-content">
          <header className="topbar">
            <div>Welcome, Admin</div>
            <div className="right">Today: {new Date().toLocaleDateString()}</div>
          </header>

          <section className="page-wrap">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddStudent />} />
              <Route path="/take-attendance" element={<TakeAttendance />} />

              {/* NEW ROUTES */}
              <Route path="/attendance-log" element={<AttendanceLog />} />
              <Route path="/student-attendance" element={<StudentAttendance />} />
            </Routes>
          </section>
        </main>

      </div>
    </Router>
  );
}
