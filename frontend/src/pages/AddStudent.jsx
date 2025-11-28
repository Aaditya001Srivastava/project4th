import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

// Firebase Imports: db (Firestore) and storage (Storage)
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddStudent() {
  const webcamRef = useRef(null);

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [contact, setContact] = useState("");
  const [guardian, setGuardian] = useState("");
  const [address, setAddress] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState("");
  const [message, setMessage] = useState("");

  // Capture webcam image
  const captureFromWebcam = () => {
    const img = webcamRef.current.getScreenshot();
    if (img) {
      setCapturedDataUrl(img);
      setPhotoFile(null);
    }
  };

  // File input handler
  const handleFileInput = (e) => {
    const f = e.target.files[0];
    if (f) {
      setPhotoFile(f);
      setCapturedDataUrl("");
    }
  };

  // Convert dataURL → File (Helper function defined locally)
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !studentId) {
      setMessage("Please fill name and student ID");
      return;
    }

    try {
      let photoURL = "";
      let photoPath = "";

      // Check for photo existence
      if (!photoFile && !capturedDataUrl) {
        setMessage("Please upload or capture a photo");
        return;
      }
      
      // Upload photo to Storage
      if (photoFile || capturedDataUrl) {
          const fileToUpload = photoFile || dataURLtoFile(capturedDataUrl, `${studentId}-${Date.now()}.jpg`);
          photoPath = `students/${studentId}.jpg`;
          const storageRef = ref(storage, photoPath);
          await uploadBytes(storageRef, fileToUpload);
          photoURL = await getDownloadURL(storageRef);
      }

      // SAVE DATA TO FIRESTORE (Writes to the "students" collection)
      await addDoc(collection(db, "students"), {
        name,
        studentId,
        email,
        course,
        year,
        contact,
        guardian,
        address,
        photoURL,
        photoPath, // store storage path for delete
        createdAt: new Date(),
      });

      setMessage("Student added successfully!");

      // Reset form (omitted for brevity in this response but kept in code)
      setName(""); setStudentId(""); setEmail(""); setCourse(""); setYear(""); setContact(""); 
      setGuardian(""); setAddress(""); setPhotoFile(null); setCapturedDataUrl("");
      
    } catch (err) {
      console.error(err);
      setMessage("Error adding student.");
    }
  };

  return (
    <div>
      <h2>Register Student</h2>

      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <label>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />

              <label>Student ID</label>
              <input value={studentId} onChange={(e) => setStudentId(e.target.value)} />

              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />

              <label>Course</label>
              <input value={course} onChange={(e) => setCourse(e.target.value)} />

              <label>Year / Semester</label>
              <input value={year} onChange={(e) => setYear(e.target.value)} />
            </div>

            <div className="col">
              <label>Contact</label>
              <input value={contact} onChange={(e) => setContact(e.target.value)} />

              <label>Guardian Contact</label>
              <input value={guardian} onChange={(e) => setGuardian(e.target.value)} />

              <label>Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} />

              <label>Upload Photo</label>
              <input type="file" accept="image/*" onChange={handleFileInput} />

              <label style={{ marginTop: 12 }}>Or Capture from Camera</label>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={240} />
                <button type="button" className="btn btn-primary" onClick={captureFromWebcam}>
                  Capture
                </button>
              </div>

              {capturedDataUrl && (
                <div style={{ marginTop: 10 }}>
                  <p>Preview:</p>
                  <img src={capturedDataUrl} alt="captured" style={{ width: 140, borderRadius: 8 }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 16 }} className="space-between">
            <button type="submit" className="btn btn-primary">
              Save Student
            </button>

            {message && (
              <span style={{ color: "#064e3b", fontWeight: "bold" }}>
                {message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}