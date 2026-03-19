// Filename: TakeAttendance.jsx
import { useRef, useState } from "react";
import Webcam from "react-webcam";
//const Webcam = require("react-webcam").default;

export default function TakeAttendance() {
  const webcamRef = useRef(null);

  const [capturedPhoto, setCapturedPhoto] = useState("");

  // 📍 Get device location
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => reject("Location permission denied")
      );
    });
  };

  // 📍 Distance calculator
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;


    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // 🕒 Detect current class period
  function getCurrentPeriod() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const periods = [
      { id: 1, start: 9 * 60, end: 9 * 60 + 50 },
      { id: 2, start: 9 * 60 + 50, end: 9 * 60 + 100 },
      { id: 3, start: 9 * 60 + 100, end: 9 * 60 + 150 },
      { id: 4, start: 9 * 60 + 150, end: 9 * 60 + 200 },
      { id: 5, start: 9 * 60 + 200, end: 9 * 60 + 250 }
    ];

    for (let p of periods) {
      if (minutes >= p.start && minutes < p.end) {
        return p.id;
      }
    }

    return null;
  }

  const capturePhoto = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    if (imgSrc) {
      setCapturedPhoto(imgSrc);
    }
  };

  // 🔥 Face Recognition + Auto Attendance
  const recognizeFace = async () => {
    if (!capturedPhoto) {
      alert("Please capture a photo!");
      return;
    }

    const IERT_LAT = 25.4286;
    const IERT_LON = 81.8463;
    const RADIUS=20;

    try {
      const location = await getLocation();

      const distance = getDistance(
        location.latitude,
        location.longitude,
        IERT_LAT,
        IERT_LON
      );

console.log("Your Lat:", location.latitude);
console.log("Your Lon:", location.longitude);
console.log("Distance from IERT (km):", distance);

// ✅ FIXED LOGIC
if (distance > RADIUS) {
  alert("You are not inside IERT campus!");
  return;
}

      const response = await fetch("https://project4th-backend.onrender.com/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: capturedPhoto }),
      });

      const data = await response.json();

      if (data.status === "outside_time") {
        alert("Attendance allowed only between 9 AM and 1 PM");
        return;
      }

      if (data.status === "already_marked") {
        alert("Attendance already marked for this period");
        return;
      }

      if (data.status === "no_face") {
        alert("No face detected!");
        return;
      }

      if (data.status === "unknown") {
        alert("Face not recognized!");
        return;
      }

      if (data.status === "matched") {

        const period = getCurrentPeriod();

        if (!period) {
          alert("Attendance allowed only between 9 AM and 1 PM");
          return;
        }

        alert("Attendance marked for " + data.name + " (Period " + period + ")");

        setCapturedPhoto("");
      }

     } catch (error) {
      console.error(error);
      alert("Recognition error");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Take Attendance
      </h2>

      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={300}
          height={220}
          playsInline
          videoConstraints={{
            facingMode: "user"
          }}
          style={{ borderRadius: 8, border: "2px solid #2ecc71" }}
        />

        <button
          onClick={capturePhoto}
          style={{
            padding: "10px 20px",
            background: "#2ecc71",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Capture Photo
        </button>
      </div>

      {capturedPhoto && (
        <div style={{ marginBottom: 20 }}>
          <p>Preview:</p>
          <img
            src={capturedPhoto}
            alt="captured"
            style={{ width: 200, borderRadius: 8 }}
          />
        </div>
      )}

      <button
        onClick={recognizeFace}
        style={{
          padding: "10px 25px",
          background: "#3498db",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        Recognize & Mark Attendance
      </button>
    </div>
  );
}