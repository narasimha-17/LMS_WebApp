// server/src/routes/examAnswers.routes.js

const router = require("express").Router();
const ctrl = require("../controllers/examAnswers.controller");

// --- DEBUG ROUTE (List all answers) ---
router.get("/debug/all", async (req, res) => {
  try {
    const prisma = require("../prisma/client");
    const rows = await prisma.exam_answers.findMany({
      orderBy: { answer_id: "asc" }
    });

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- CREATE ANSWER ---
router.post("/", ctrl.create);

// --- GET ANSWERS BY ATTEMPT ---
router.get("/attempt/:attemptId", ctrl.getByAttempt);

module.exports = router;
