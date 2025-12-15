const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

// ------------------------------------------------------
// GET ALL EXAM SESSIONS
// ------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const sessions = await prisma.exam_sessions.findMany({
      include: {
        exams: true,
        users: true
      }
    });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (err) {
    console.error("Error fetching exam sessions:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exam sessions",
      error: err.message
    });
  }
});

// ------------------------------------------------------
// GET ONE EXAM SESSION BY ID
// ------------------------------------------------------
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const session = await prisma.exam_sessions.findUnique({
      where: { id },
      include: {
        exams: true,
        users: true,
        exam_attempts: true
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: `Exam session ${id} not found`
      });
    }

    res.json({ success: true, data: session });
  } catch (err) {
    console.error("Error fetching exam session:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exam session",
      error: err.message
    });
  }
});

// ------------------------------------------------------
// CREATE NEW EXAM SESSION (Start Exam)
// ------------------------------------------------------
router.post("/", async (req, res) => {
  console.log("📩 Incoming Start Exam Request Body:", req.body); // ADD THIS

  const { exam_id, user_id, start_time } = req.body;

  if (!exam_id || !user_id) {
    console.log("❌ Missing exam_id or user_id");  // ADD THIS
    return res.status(400).json({
      success: false,
      message: "exam_id and user_id are required"
    });
  }

  try {
    const session = await prisma.exam_sessions.create({
      data: {
        exam_id,
        user_id,
        start_time: start_time || new Date(),
        status: "IN_PROGRESS"
      }
    });

    res.json({
      success: true,
      message: "Exam session started",
      data: session
    });
  } catch (err) {
    console.error("Error creating exam session:", err);
    res.status(500).json({
      success: false,
      message: "Failed to start exam session",
      error: err.message
    });
  }
});


// ------------------------------------------------------
// UPDATE EXAM SESSION (Submit or Save Progress)
// ------------------------------------------------------
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { status, end_time } = req.body;

  try {
    const updated = await prisma.exam_sessions.update({
      where: { id }, // FIXED
      data: {
        status,
        end_time
      }
    });

    res.json({
      success: true,
      message: "Session updated",
      data: updated
    });
  } catch (err) {
    console.error("Error updating exam session:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update exam session",
      error: err.message
    });
  }
});

// ------------------------------------------------------
// DELETE EXAM SESSION
// ------------------------------------------------------
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.exam_sessions.delete({
      where: { id } // FIXED
    });

    res.json({
      success: true,
      message: `Exam session ${id} deleted`
    });
  } catch (err) {
    console.error("Error deleting exam session:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete exam session",
      error: err.message
    });
  }
});

// ❌ REMOVED /start route (it was wrong)

module.exports = router;
