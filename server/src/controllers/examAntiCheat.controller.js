const prisma = require("../prisma/client");

// POST: log anti-cheat event
exports.log = async (req, res) => {
  try {
    const { exam_session_id, user_id, event_type, event_payload } = req.body;

    if (!exam_session_id || !user_id || !event_type) {
      return res.status(400).json({
        success: false,
        message: "exam_session_id, user_id, and event_type are required",
      });
    }

    const log = await prisma.exam_anti_cheat_logs.create({
      data: {
        exam_session_id,
        user_id,
        event_type,
        event_payload: event_payload || null,
      },
    });

    res.json({ success: true, data: log });
  } catch (err) {
    console.error("Anti-cheat log error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create anti-cheat log",
      error: err.message,
    });
  }
};

// GET: logs by session ID
exports.getBySession = async (req, res) => {
  try {
    const sessionId = Number(req.params.sessionId);

    const logs = await prisma.exam_anti_cheat_logs.findMany({
      where: { exam_session_id: sessionId },
      orderBy: { event_time: "desc" },
    });

    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    console.error("Fetch anti-cheat logs error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
      error: err.message,
    });
  }
};
