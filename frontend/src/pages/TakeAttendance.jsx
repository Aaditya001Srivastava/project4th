import React, { useState, useEffect, useRef } from 'react';
import Webcam from "react-webcam";
// 1. Firebase Imports (db for Firestore, and functions for writing data)
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore'; 

/**
 * Saves a new attendance record to Firestore.
 * This function is defined locally to avoid needing a separate utils folder.
 * @param {string} studentId - The ID of the recognized student.
 * @param {object} location - The geotagged location { latitude, longitude }.
 * @returns {Promise<void>}
 */
const recordAttendance = async (studentId, location) => {
  try {
    // 2. Writes data to the "attendance" collection
    await addDoc(collection(db, "attendance"), {
      studentId: studentId,
      timestamp: new Date(),
      latitude: location.latitude,
      longitude: location.longitude,
    });
    console.log(`Attendance recorded for ${studentId}.`);
  } catch (e) {
    console.error("Error recording attendance: ", e);
    // In a production app, you would show a user-friendly error here.
    alert("Failed to save attendance record to the database."); 
  }
};


export default function TakeAttendance() {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("Initializing...");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to get the user's current GeoLocation
  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setStatus("Location captured. Ready to mark attendance.");
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setStatus(`Location error: ${error.message}. Please enable location.`);
        }
      );
    } else {
      setStatus("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    // Get location immediately on load
    getGeoLocation();
  }, []);

  // Handler for the core Face Recognition and Firebase Write
  const handleMarkAttendance = async () => {
    if (isProcessing || !currentLocation) {
      alert("Please wait for location data or ensure location access is enabled.");
      return;
    }
    
    setIsProcessing(true);
    setStatus("Capturing image and recognizing face...");

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      
      // -------------------------------------------------------------------
      // ⚠️ REPLACE THIS MOCK LOGIC WITH YOUR ACTUAL FACE RECOGNITION CODE
      // -------------------------------------------------------------------
      
      // MOCK DATA: Simulating a 3-second face recognition delay
      await new Promise(resolve => setTimeout(resolve, 3000)); 
      
      // MOCK RESULT: Randomly succeed with a student ID or fail
      const recognizedStudentId = Math.random() > 0.3 ? "S123456" : null; 
      
      // -------------------------------------------------------------------

      if (recognizedStudentId) {
        // SUCCESS: Record attendance using the local function defined above
        await recordAttendance(recognizedStudentId, currentLocation); 
        setStatus(`Attendance marked successfully for Student: ${recognizedStudentId}`);
      } else {
        setStatus("Recognition failed. Face not matched or not enrolled.");
      }

    } catch (err) {
      console.error("Attendance Process Error:", err);
      setStatus("An unexpected error occurred during the attendance process.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mark Attendance via Face ID</h2>
      
      <div className="card p-6 shadow-lg">
          <div className="camera-section flex flex-col items-center">
            <Webcam 
              audio={false} 
              ref={webcamRef} 
              screenshotFormat="image/jpeg" 
              width={480} // Set a fixed width for the webcam feed
              videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user"
              }}
              className="rounded-lg shadow-md mb-4"
            />
            
            <button 
              onClick={handleMarkAttendance} 
              disabled={isProcessing || !currentLocation}
              className={`py-3 px-8 text-white font-semibold rounded-lg transition-all transform hover:scale-105 ${
                  isProcessing || !currentLocation ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md'
              }`}
            >
              {isProcessing ? "Processing..." : "Mark Attendance Now"}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-700">Status: <span className="text-blue-600 font-bold">{status}</span></p>
            {currentLocation && (
              <p className="text-sm text-gray-500">
                Geo-Location: Lat <span className="font-mono text-xs">{currentLocation.latitude.toFixed(5)}</span>, 
                Lon <span className="font-mono text-xs">{currentLocation.longitude.toFixed(5)}</span>
              </p>
            )}
          </div>
      </div>
    </div>
  );
}