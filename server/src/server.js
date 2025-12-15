// server/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = require("./src/app");  // Load app.js from src/
const port = process.env.PORT || 4000;

// ---------------- MIDDLEWARE ----------------
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// ---------------- SERVER LISTEN ----------------
app.listen(port, () => {
  console.log(`🚀 LMS API server running at http://localhost:${port}`);
});

app.use("/api/exams", require("./src/routes/exam.routes"));
app.use("/api/exam-questions", require("./src/routes/examQuestions.routes"));
app.use("/api/exam-sessions", require("./src/routes/examSessions.routes"));
app.use("/api/exam-attempts", require("./src/routes/examAttempts.routes"));