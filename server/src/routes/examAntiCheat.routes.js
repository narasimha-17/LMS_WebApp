// server/src/routes/examAntiCheat.routes.js

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/examAntiCheat.controller");

// --- route check ---
router.get("/debug", (req, res) => {
  res.json({ route: "exam-anti-cheat OK" });
});

// --- GET logs by sessionId ---
router.get("/session/:sessionId", ctrl.getBySession);

// --- POST new anti-cheat log ---
router.post("/", ctrl.log);

module.exports = router;
