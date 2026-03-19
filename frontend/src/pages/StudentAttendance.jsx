// Filename: StudentAttendance.jsx
import React, { useEffect, useState } from "react";

export default function StudentAttendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  // 🔥 NEW STATE
  const [search, setSearch] = useState("");

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

  // 🔥 FILTERED STUDENTS
  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.first_name?.toLowerCase().includes(q) ||
      s.last_name?.toLowerCase().includes(q) ||
      s.branch?.toLowerCase().includes(q)
    );
  });

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

      {/* 🔥 SEARCH INPUT */}
      <label>Search Student:</label>
      <input
        type="text"
        placeholder="Type name or branch..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          marginTop: 10,
          marginBottom: 10,
        }}
      />

      {/* 🔥 DROPDOWN */}
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        style={{ width: "100%", padding: 10, borderRadius: 6 }}
      >
        <option value="">-- Choose Student --</option>

        {filteredStudents.map((s) => (
          <option value={s._id} key={s._id}>
            {s.first_name} {s.last_name} ({s.branch})
          </option>
        ))}
      </select>

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