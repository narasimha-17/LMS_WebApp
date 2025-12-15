const prisma = require("../prisma/client");

// -----------------------------------------------------------
// CREATE ANSWER
// -----------------------------------------------------------
async function create(req, res) {
  try {
    const {
      attempt_id,
      question_id,
      selected_options,
      time_taken_seconds
    } = req.body;

    if (!attempt_id || !question_id) {
      return res.status(400).json({
        success: false,
        message: "attempt_id and question_id are required"
      });
    }

    const answer = await prisma.exam_answers.create({
      data: {
        attempt_id,
        question_id,
        selected_options: selected_options || null,
        time_spent_seconds: time_taken_seconds || 0
      }
    });

    res.json({
      success: true,
      message: "Answer submitted successfully",
      data: answer
    });

  } catch (err) {
    console.error("❌ Error creating exam answer:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: err.message
    });
  }
}

// -----------------------------------------------------------
// GET ANSWERS BY ATTEMPT
// -----------------------------------------------------------
async function getByAttempt(req, res) {
  try {
    const attemptId = Number(req.params.attemptId);

    if (!attemptId) {
      return res.status(400).json({
        success: false,
        message: "Valid attemptId is required"
      });
    }

    const answers = await prisma.exam_answers.findMany({
      where: { attempt_id: attemptId },
      include: {
        questions: true,
        exam_attempts: {
          include: {
            exams: true,
            users: true
          }
        }
      }
    });

    res.json({
      success: true,
      count: answers.length,
      data: answers
    });

  } catch (err) {
    console.error("❌ Error fetching answers:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch answers",
      error: err.message
    });
  }
}

// -----------------------------------------------------------
// EXPORT HANDLERS
// -----------------------------------------------------------
module.exports = {
  create,
  getByAttempt
};
