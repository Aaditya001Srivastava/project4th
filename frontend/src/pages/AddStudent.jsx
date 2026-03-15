// Filename: AddStudent.jsx

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
console.log("THIS ADDSTUDENT IS LOADED");

export default function AddStudent() { 
  const webcamRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [branch, setBranch] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState("");
  const [message, setMessage] = useState("");

  const captureFromWebcam = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) {
      setCapturedDataUrl(img);
      setPhotoFile(null);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setCapturedDataUrl("");
    }
  };

  // 🔥 CHANGED: Now using MongoDB instead of localStorage
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("HANDLE SUBMIT CALLED");

  if (!firstName || !lastName || !dob || !branch || !mobileNumber) {
    setMessage("Please fill all fields");
    return;
  }

  if (!photoFile && !capturedDataUrl) {
    setMessage("Please upload or capture a photo");
    return;
  }

  let photoURL = capturedDataUrl;

  if (photoFile) {
    const reader = new FileReader();
    reader.readAsDataURL(photoFile);

    await new Promise((resolve) => {
      reader.onloadend = () => {
        photoURL = reader.result;
        resolve();
      };
    });
  }

  try {
    await fetch("http://localhost:5000/register-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        dob,
        branch,
        mobile_number: mobileNumber,
        photo: photoURL
      }),
    });

    setMessage("Student saved successfully!");

    setFirstName("");
    setLastName("");
    setDob("");
    setBranch("");
    setMobileNumber("");
    setPhotoFile(null);
    setCapturedDataUrl("");

  } catch (error) {
    console.error(error);
    setMessage("Error saving student.");
  }
};
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>Register Student</h2>

      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label>First Name</label>
              <input style={inputStyle} value={firstName}
                onChange={(e) => setFirstName(e.target.value)} />

              <label>Last Name</label>
              <input style={inputStyle} value={lastName}
                onChange={(e) => setLastName(e.target.value)} />

              <label>DOB</label>
              <input style={inputStyle} type="date" value={dob}
                onChange={(e) => setDob(e.target.value)} />

              <label>Branch</label>
              <input style={inputStyle} value={branch}
                onChange={(e) => setBranch(e.target.value)} />

              <label>Mobile Number</label>
              <input style={inputStyle} value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)} />
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <label>Upload Photo</label>
              <input style={inputStyle} type="file"
                accept="image/*" onChange={handleFileInput} />

              <label style={{ marginTop: 12 }}>Or Capture from Camera</label>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10 }}>
                <Webcam audio={false} ref={webcamRef}
                  screenshotFormat="image/jpeg" width={200} />
                <button type="button" style={buttonStyle}
                  onClick={captureFromWebcam}>
                  Capture
                </button>
              </div>

              {capturedDataUrl && (
                <div style={{ marginTop: 15 }}>
                  <p style={{ margin: "5px 0" }}>Preview:</p>
                  <img src={capturedDataUrl}
                    alt="captured"
                    style={{ width: 140, borderRadius: 8 }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button type="submit" style={buttonStyle}>
              Save Student
            </button>
          </div>
        </form>

        {message && (
          <p style={{ color: "green", textAlign: "center", marginTop: 15 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 5,
  marginBottom: 15,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
};

const buttonStyle = {
  padding: "10px 20px",
  background: "#2ecc71",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
};