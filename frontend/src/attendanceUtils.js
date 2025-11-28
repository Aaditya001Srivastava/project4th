// src/utils/attendanceUtils.js

// Ensure you import db from your central firebase file
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore'; 

/**
 * Saves a new attendance record to Firestore.
 * @param {string} studentId - The ID of the recognized student.
 * @param {object} location - The geotagged location { latitude, longitude }.
 * @returns {Promise<void>}
 */
export const recordAttendance = async (studentId, location) => {
  try {
    await addDoc(collection(db, "attendance"), {
      studentId: studentId,
      timestamp: new Date(),
      latitude: location.latitude,
      longitude: location.longitude,
    });
    console.log(`Attendance recorded for ${studentId}.`);
  } catch (e) {
    console.error("Error recording attendance: ", e);
    throw new Error("Failed to save attendance record.");
  }
};