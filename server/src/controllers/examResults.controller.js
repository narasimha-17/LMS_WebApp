const prisma = require("../prisma/client");

// -----------------------------------------------------------
// LIST ALL RESULTS
// -----------------------------------------------------------
exports.list = async (req, res) => {
  try {
    const rows = await prisma.exam_results.findMany({
      orderBy: { result_id: "asc" }
    });

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error listing exam results",
      error: err.message
    });
  }
};

// -----------------------------------------------------------
// GET RESULTS BY ATTEMPT ID
// -----------------------------------------------------------
exports.getByAttempt = async (req, res) => {
  try {
    const attemptId = Number(req.params.attemptId);

    const result = await prisma.exam_results.findFirst({
      where: { attempt_id: attemptId },
      include: {
        exams: true,
        users: true,
        exam_sessions: true
      }
    });

    if (!result) {
      return res.json({
        success: false,
        message: "No result found for this attempt"
      });
    }

    res.json({ success: true, data: result });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching result",
      error: err.message
    });
  }
};

// -----------------------------------------------------------
// CREATE RESULT ENTRY
// -----------------------------------------------------------
exports.create = async (req, res) => {
  try {
    const payload = req.body;

    const result = await prisma.exam_results.create({
      data: payload
    });

    res.json({ success: true, data: result });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating result",
      error: err.message
    });
  }
};
