// Filename: StudentAttendance.jsx
import React, { useEffect, useState } from "react";

export default function StudentAttendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  // Fetch from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await fetch("http://localhost:5000/students");
        const studentData = await studentRes.json();

        const attendanceRes = await fetch("http://localhost:5000/attendance");
        const attendanceData = await attendanceRes.json();

        setStudents(studentData);
        setRecords(attendanceData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // ✅ FIXED FILTER
  const studentHistory = records.filter(
    (r) => String(r.studentId?._id) === String(selectedId)
  );

  const selectedStudent = students.find(
    (s) => String(s._id) === String(selectedId)
  );

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Student Attendance History</h2>

      <label>Select Student:</label>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        style={{ width: "100%", padding: 10, borderRadius: 6, marginTop: 10 }}
      >
        <option value="">-- Choose Student --</option>

        {students.map((s) => (
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