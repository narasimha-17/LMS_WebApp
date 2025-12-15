// server/src/app.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ------------------- MIDDLEWARE -------------------
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ------------------- ROUTES IMPORT -------------------
const authRoutes = require("./routes/auth.routes");
const certificationRoutes = require("./routes/certification.routes");
const testRoutes = require("./routes/test.routes");

// ---- EXAM ROUTES ----
const examRoutes = require("./routes/exam.routes");
const examQuestionsRoutes = require("./routes/examQuestions.routes");
const examSessionsRoutes = require("./routes/examSessions.routes");
const examAttemptsRoutes = require("./routes/examAttempts.routes");
const examAnswersRoutes = require("./routes/examAnswers.routes");
const examResultsRoutes = require("./routes/examResults.routes");
const examResultDomainsRoutes = require("./routes/examResultDomains.routes");
const examDomainDistributionRoutes = require("./routes/examDomainDistribution.routes");
const examAntiCheatRoutes = require("./routes/examAntiCheat.routes");
const examSessionsRoutes = require("./routes/examSessions.routes");
const examRoutes = require("./routes/exam.routes");



// ------------------- HEALTH CHECK -------------------
app.get("/", (req, res) => {
  res.json({
    message: "LMS API Server Running 🚀",
    env: process.env.NODE_ENV || "development",
  });
});

// ------------------- ROUTES -------------------
app.use("/api/auth", authRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/tests", testRoutes);

// ---- EXAM ROUTE REGISTER ----
app.use("/api/exams", examRoutes);
app.use("/api/exam-questions", examQuestionsRoutes);
app.use("/api/exam-sessions", examSessionsRoutes);
app.use("/api/exam-attempts", examAttemptsRoutes);
app.use("/api/exam-answers", examAnswersRoutes);
app.use("/api/exam-results", examResultsRoutes);
app.use("/api/exam-result-domains", examResultDomainsRoutes);
app.use("/api/exam-domain-distribution", examDomainDistributionRoutes);
app.use("/api/exam-anti-cheat", examAntiCheatRoutes);
app.use("/api/exam-sessions", examSessionsRoutes);
app.use("/api/exams", require("./src/routes/exam.routes"));



// ------------------- 404 HANDLER -------------------
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found`,
  });
});

// ------------------- ERROR HANDLER -------------------
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message,
  });
});

module.exports = app;
