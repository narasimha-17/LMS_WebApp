// routes/examQuestions.routes.js
const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

// GET ALL exam_questions
router.get("/", async (req, res) => {
  try {
    const questions = await prisma.exam_questions.findMany({
      include: {
        // adjust to your relation field names if needed (exam vs exams)
        exam: true,
        question: true,
      },
      orderBy: { exam_question_id: "asc" }
    });

    res.json({ success: true, count: questions.length, data: questions });
  } catch (err) {
    console.error("Error fetching exam questions:", err);
    res.status(500).json({ success: false, message: "Failed to fetch exam questions", error: err.message });
  }
});

// GET ONE exam_question by ID
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: "Invalid id" });

  try {
    const question = await prisma.exam_questions.findUnique({
      where: { exam_question_id: id },
      include: { exam: true, question: true }
    });

    if (!question) return res.status(404).json({ success: false, message: "Exam question not found" });

    res.json({ success: true, data: question });
  } catch (err) {
    console.error("Error fetching exam question:", err);
    res.status(500).json({ success: false, message: "Error fetching exam question", error: err.message });
  }
});

module.exports = router;
