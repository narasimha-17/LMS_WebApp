require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: "http://localhost:3000",
  credentials: true,

 }));
app.use(express.json());

// =============================
//      EXAM ROUTES — IMPORTANT!
app.use("/api/exams", require("./src/routes/exam.routes"));
// =============================

// Other routes
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/certifications", require("./src/routes/certification.routes"));
app.use("/api/questions", require("./src/routes/question.routes"));
app.use("/api/admin", require("./src/routes/roleModule.routes"));
app.use("/api/auth", require("./src/routes/auth.routes"));

console.log("Loading leaderboard...");
app.use("/api/leaderboard", require("./src/routes/leaderboard.routes"));






// Root route
app.get("/", (req, res) => {
  res.json({ message: "API Server Running 🚀" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
