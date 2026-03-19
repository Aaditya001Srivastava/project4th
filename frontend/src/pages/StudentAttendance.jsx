// Filename: StudentAttendance.jsx
import React, { useEffect, useState } from "react";

export default function StudentAttendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  // 🔥 NEW STATES
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await fetch("https://project4th-backend-1.onrender.com/students");
        const studentData = await studentRes.json();

        const attendanceRes = await fetch("https://project4th-backend-1.onrender.com/attendance");
        const attendanceData = await attendanceRes.json();

        setStudents(studentData);
        setRecords(attendanceData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // ✅ FILTER RECORDS
  const studentHistory = records.filter(
    (r) => String(r.studentId?._id) === String(selectedId)
  );

  const selectedStudent = students.find(
    (s) => String(s._id) === String(selectedId)
  );

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Student Attendance History</h2>

      {/* 🔥 MODERN SEARCHABLE DROPDOWN */}
      <label>Select Student:</label>

      <div style={{ position: "relative", marginTop: 10 }}>
        {/* INPUT BOX */}
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            cursor: "pointer",
            background: "#fff",
          }}
        >
          {selectedStudent
            ? `${selectedStudent.first_name} ${selectedStudent.last_name} (${selectedStudent.branch})`
            : "Search or select student..."}
        </div>

        {/* DROPDOWN */}
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 8,
              marginTop: 5,
              maxHeight: 250,
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            {/* SEARCH INPUT */}
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                border: "none",
                borderBottom: "1px solid #eee",
                outline: "none",
              }}
            />

            {/* LIST */}
            {students
              .filter((s) =>
                `${s.first_name} ${s.last_name} ${s.branch}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((s) => (
                <div
                  key={s._id}
                  onClick={() => {
                    setSelectedId(s._id);
                    setShowDropdown(false);
                    setSearch("");
                  }}
                  style={{
                    padding: 10,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  {s.first_name} {s.last_name} ({s.branch})
                </div>
              ))}
          </div>
        )}
      </div>

      {selectedId && (
        <div style={{ marginTop: 20 }}>
          <h3>
            Attendance for {selectedStudent?.first_name}{" "}
            {selectedStudent?.last_name}
          </h3>

          {studentHistory.length === 0 ? (
            <p>No attendance marked yet for this student.</p>
          ) : (
            <table
              border={1}
              cellPadding={5}
              style={{ width: "100%", marginTop: 20 }}
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Period</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {studentHistory.map((a, index) => (
                  <tr key={index}>
                    <td>{a.date}</td>
                    <td>{a.period}</td>
                    <td>{a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}