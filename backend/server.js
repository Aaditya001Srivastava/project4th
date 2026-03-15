const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
//const { spawn } = require("child_process");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const app = express();

/* ✅ PROPER CORS */
const cors = require("cors");

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.options("*", cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

console.log("ENV CHECK:", process.env.MONGO_URI);

/* ===========================
   CONNECT MONGODB SAFELY
=========================== */

mongoose.set("strictQuery", false);

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is undefined. Check your .env file.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
    console.log("Connected DB Name:", mongoose.connection.name);
    console.log("Ready State:", mongoose.connection.readyState);

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });

  } catch (err) {
    console.error("Mongo Error:", err);
    process.exit(1);
  }
}

startServer();

/* ===========================
   STUDENT SCHEMA
=========================== */

const StudentSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  dob: String,
  branch: String,
  mobile_number: String,
  photo: String,
  faceEncoding: [Number]
});
const Student = mongoose.model("Student", StudentSchema);

/* ===========================
   ATTENDANCE SCHEMA
=========================== */

const AttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  name: String,
  date: String,
  period: Number,
  time: String,
  timestamp: String
});
const Attendance = mongoose.model("Attendance", AttendanceSchema);

/* ===========================
   STUDENT ROUTES
=========================== */

app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving student" });
  }
});

app.get("/students", async (req, res) => {
  try {
    console.log("Connection state at query:", mongoose.connection.readyState);
    const students = await Student.find().lean();
    res.json(students);
  } catch (error) {
    console.error("REAL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

/* ===========================
   REGISTER STUDENT
=========================== */

app.post("/register-student", async (req, res) => {
  try {
    //const python = spawn("py", ["-3.10", "face_encode.py"]);
    const response = await axios.post(
      "https://project4th-production.up.railway.app",
      { image: req.body.photo }
    );

const parsed = response.data;
    python.stdout.on("data", async (data) => {
      try {
        const parsed = JSON.parse(data.toString());

        if (!parsed.success) {
          return res.status(400).json({ message: "Face not detected" });
        }

        const encoding = parsed.encoding;

        const student = new Student({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          dob: req.body.dob,
          branch: req.body.branch,
          mobile_number: req.body.mobile_number,
          photo: req.body.photo,
          faceEncoding: encoding
        });

        await student.save();
        res.json({ message: "Student registered successfully" });

      } catch (err) {
        console.error("Encoding parse error:", err);
        res.status(500).json({ message: "Encoding failed" });
      }
    });

    python.stderr.on("data", (data) => {
      console.error("Python Error:", data.toString());
    });

  } catch (err) {
    res.status(500).json({ message: "Error registering student" });
  }
});

/* ===========================
   ATTENDANCE ROUTES
=========================== */

app.post("/attendance", async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error saving attendance" });
  }
});

app.get("/attendance", async (req, res) => {
  try {
    const records = await Attendance.find().populate("studentId");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
});

app.delete("/attendance/:id", async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: "Attendance deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting attendance" });
  }
});

/* ===========================
   FACE RECOGNITION
=========================== */

function euclideanDistance(arr1, arr2) {
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += (arr1[i] - arr2[i]) ** 2;
  }
  return Math.sqrt(sum);
}

app.post("/recognize", async (req, res) => {
  try {
    //const python = spawn("py", ["-3.10", "face_encode.py"]);
    const response = await axios.post(
      "https://project4th-production.up.railway.app",
      { image: req.body.photo }
    );

const parsed = response.data;

    let output = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.on("close", async () => {

      const parsed = JSON.parse(output);

      if (!parsed.success) {
        return res.json({ status: "no_face" });
      }

      const unknownEncoding = parsed.encoding;

      const students = await Student.find();

      let bestMatch = null;
      let smallestDistance = Infinity;

      students.forEach(student => {
        if (!student.faceEncoding) return;

        const distance = euclideanDistance(
          unknownEncoding,
          student.faceEncoding
        );

        if (distance < smallestDistance) {
          smallestDistance = distance;
          bestMatch = student;
        }
      });

      if (smallestDistance < 0.45 && bestMatch) {

        const now = new Date();
        const minutes = now.getHours() * 60 + now.getMinutes();

        let period = null;

        const periods = [
          { id: 1, start: 9 * 60, end: 9 * 60 + 50 },
          { id: 2, start: 9 * 60 + 50, end: 9 * 60 + 100 },
          { id: 3, start: 9 * 60 + 100, end: 9 * 60 + 150 },
          { id: 4, start: 9 * 60 + 150, end: 9 * 60 + 200 },
          { id: 5, start: 9 * 60 + 200, end: 9 * 60 + 250 }
        ];

        for (let p of periods) {
          if (minutes >= p.start && minutes < p.end) {
            period = p.id;
            break;   // FIX
          }
        }

        const today = now.toDateString();

        const existingAttendance = await Attendance.findOne({
          studentId: bestMatch._id,
          date: today,
          period: period
        });

        if (existingAttendance) {
          return res.json({
            status: "already_marked",
            name: bestMatch.first_name + " " + bestMatch.last_name
          });
        }

        const attendance = new Attendance({
          studentId: bestMatch._id,
          name: bestMatch.first_name + " " + bestMatch.last_name,
          date: today,
          period: period,
          time: now.toLocaleTimeString(),
          timestamp: now.toLocaleString()
        });

        await attendance.save();

        return res.json({
          status: "matched",
          name: bestMatch.first_name + " " + bestMatch.last_name,
          studentId: bestMatch._id,
          distance: smallestDistance
        });
      }

      return res.json({ status: "unknown" });

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error" });
  }
});