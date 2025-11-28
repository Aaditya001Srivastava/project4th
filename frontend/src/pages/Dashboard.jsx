import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebase";

export default function Dashboard() {
  // Existing state for Student Roster
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  
  // NEW State for Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState([]); 

  // --- 1. Real-time load Student Roster ("students" collection) ---
  useEffect(() => {
    const unsubStudents = onSnapshot(collection(db, "students"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(list);
    });

    return () => unsubStudents();
  }, []);

  // --- 2. Real-time load Attendance Records ("attendance" collection) ---
  useEffect(() => {
    // Query to fetch attendance records, ordered by newest first (desc)
    const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"));
    
    // Listens to the 'attendance' collection
    const unsubAttendance = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttendanceRecords(records);
    });

    return () => unsubAttendance();
  }, []);


  // --- DELETE STUDENT ---
  const handleDelete = async (id, photoPath) => {
    // Replaced window.confirm with a console message/custom modal approach in a real app, 
    // but preserving the original structure for context.
    if (!window.confirm("Delete this student?")) return; 

    try {
      await deleteDoc(doc(db, "students", id));
      if (photoPath) {
        const imgRef = ref(storage, photoPath);
        await deleteObject(imgRef).catch((err) => console.error("Storage delete failed (may not exist):", err));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };


  // --- Filter logic ---
  const filtered = students.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.studentId && s.studentId.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* -------------------- 1. ATTENDANCE TABLE -------------------- */}
      <div style={{ marginBottom: 24, marginTop: 12 }}>
        <h2>Live Attendance Feed ⏱️</h2>
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Time</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: 24 }}>
                      No attendance records logged yet.
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.slice(0, 10).map((record) => { 
                    // Convert Firestore Timestamp to Date object
                    const date = record.timestamp?.toDate ? record.timestamp.toDate() : new Date(record.timestamp);

                    return (
                      <tr key={record.id}>
                        <td>{record.studentId}</td>
                        <td>{date.toLocaleTimeString()}</td>
                        <td>{record.latitude?.toFixed(5) || 'N/A'}</td>
                        <td>{record.longitude?.toFixed(5) || 'N/A'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <hr /> 

      {/* -------------------- 2. STUDENT ROSTER TABLE -------------------- */}
      <div className="space-between" style={{ marginBottom: 12, marginTop: 24 }}>
        <h2>Student Roster 🧑‍🎓</h2>
        
        <div style={{ display: "flex", gap: 8 }}>
            <input
              className="search"
              placeholder="Search by name / id / email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Student ID</th>
                <th>Email</th>
                <th>Course</th>
                <th>Contact</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                 <tr><td colSpan="8" style={{ textAlign: "center", padding: 24 }}> No students found.</td></tr>
              ) : (
                filtered.map((s) => (
                    <tr key={s.id}>
                    <td>
                        {s.photoURL ? (
                            <img src={s.photoURL} className="student-photo" alt={s.name} style={{ width: 48, height: 48, borderRadius: "50%" }}/>
                        ) : (
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#e6eef8", }} />
                        )}
                    </td>
                    <td>{s.name}</td>
                    <td>{s.studentId}</td>
                    <td>{s.email}</td>
                    <td>{s.course}</td>
                    <td>{s.contact}</td>
                    <td>
                        {s.createdAt ? new Date(s.createdAt.seconds * 1000).toLocaleString() : "—"}
                    </td>
                    <td>
                        <button onClick={() => handleDelete(s.id, s.photoPath)} className="btn btn-danger">Delete</button>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}