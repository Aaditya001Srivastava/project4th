// Filename: AttendanceLog.jsx
import React, { useEffect, useState } from "react";

export default function AttendanceLog() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceRes = await fetch("http://localhost:5000/attendance");
        const attendanceData = await attendanceRes.json();

        const studentRes = await fetch("http://localhost:5000/students");
        const studentData = await studentRes.json();

        setRecords(attendanceData);
        setStudents(studentData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const getStudent = (id) => {
    return students.find((s) => String(s._id) === String(id));
  };

  // 🔥 DELETE FUNCTION
  const deleteAttendance = async (id) => {
    try {
      await fetch(`http://localhost:5000/attendance/${id}`, {
        method: "DELETE",
      });

      // Remove from UI instantly
      setRecords(records.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Attendance Log</h2>

      {records.length === 0 ? (
        <p>No attendance marked yet.</p>
      ) : (
        <table border={1} cellPadding={5} style={{ width: "100%", marginTop: 20 }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Branch</th>
              <th>Date & Time</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => {

              // ✅ FIX: populated student object
              const st = r.studentId?._id
                ? r.studentId
                : getStudent(r.studentId);

              return (
                <tr key={r._id}>
                  <td>
                    {st
                      ? `${st.first_name} ${st.last_name}`
                      : "Unknown Student"}
                  </td>
                  <td>{st?.branch || "-"}</td>
                  <td>{r.timestamp}</td>
                  <td>
                    <button
                      style={{
                        padding: "5px 10px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: 5,
                        cursor: "pointer",
                      }}
                      onClick={() => deleteAttendance(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}