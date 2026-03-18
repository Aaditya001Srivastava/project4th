// Filename: App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";

// Existing pages
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import TakeAttendance from "./pages/TakeAttendance";

// New pages
import AttendanceLog from "./pages/AttendanceLog";
import StudentAttendance from "./pages/StudentAttendance";

import "./styles.css";

export default function App() {
  const [user, setUser] = useState(null);

  // 🔥 SHOW LOGIN FIRST
  if (!user) {
    return <Login setUser={setUser} />;
  }

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
              {/* ✅ ADMIN FULL ACCESS */}
              {user.role === "admin" && (
                <>
                  <li><Link to="/">Dashboard</Link></li>
                  <li><Link to="/add">Add Student</Link></li>
                  <li><Link to="/take-attendance">Mark Attendance</Link></li>
                  <li><Link to="/attendance-log">Attendance Log</Link></li>
                  <li><Link to="/student-attendance">Student Attendance</Link></li>
                </>
              )}

              {/* ✅ STUDENT ONLY ATTENDANCE */}
              {user.role === "student" && (
                <li><Link to="/take-attendance">Mark Attendance</Link></li>
              )}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="main-content">
          <header className="topbar">
            <div>
              {user.role === "admin" ? "Welcome, Admin" : "Welcome, Student"}
            </div>

            <div className="right">
              Today: {new Date().toLocaleDateString()}
            </div>
          </header>

          <section className="page-wrap">
            <Routes>

              {/* ✅ ROOT */}
              <Route
                path="/"
                element={
                  user.role === "admin" ? <Dashboard /> : <TakeAttendance />
                }
              />

              {/* ✅ ADMIN ONLY */}
              <Route
                path="/add"
                element={
                  user.role === "admin" ? <AddStudent /> : <TakeAttendance />
                }
              />

              <Route
                path="/attendance-log"
                element={
                  user.role === "admin" ? <AttendanceLog /> : <TakeAttendance />
                }
              />

              <Route
                path="/student-attendance"
                element={
                  user.role === "admin" ? <StudentAttendance /> : <TakeAttendance />
                }
              />

              {/* ✅ BOTH CAN ACCESS */}
              <Route path="/take-attendance" element={<TakeAttendance />} />

            </Routes>
          </section>
        </main>

      </div>
    </Router>
  );
}