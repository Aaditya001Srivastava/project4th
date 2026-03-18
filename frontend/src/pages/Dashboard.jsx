// Filename: Dashboard.jsx
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const res = await fetch("https://project4th-backend-1.onrender.com/students");
    const data = await res.json();
    setStudents(data);
  };

  const deleteStudent = async (id) => {
    try{
      const res=await fetch(`https://project4th-backend-1.onrender.com/students/${id}`, {
      method: "DELETE"
    });
    if (res.ok){
      setStudents(prev=>prev.filters(s=>s._id!==id));
    }
  } catch(err){
    console.error("Delete error:",err)
  }
    
  };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.first_name?.toLowerCase().includes(q) ||
      s.last_name?.toLowerCase().includes(q) ||
      s.branch?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Roster</h2>

      <input
        placeholder="Search by name or branch"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Photo</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Branch</th>
            <th>Mobile</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No students found
              </td>
            </tr>
          ) : (
            filtered.map((s) => (
              <tr key={s._id}>
                <td>
                  {s.photo && <img src={s.photo} alt="profile" width={50} />}
                </td>
                <td>{s.first_name}</td>
                <td>{s.last_name}</td>
                <td>{s.branch}</td>
                <td>{s.mobile_number}</td>
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
                    onClick={() => deleteStudent(s._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}