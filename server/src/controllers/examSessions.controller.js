const prisma = require("../prisma/client");

// ------------------------------------------------------
// START EXAM USING CERTIFICATION ID
// ------------------------------------------------------
exports.startByCertification = async (req, res) => {
  const { certificationId, user_id } = req.body;

  if (!certificationId || !user_id) {
    return res.status(400).json({
      success: false,
      message: "certificationId and user_id are required",
    });
  }

  try {
    // 1. Find ACTIVE exam for certification
    const exam = await prisma.exams.findFirst({
      where: {
        certification_id: Number(certificationId),
        status: "Active",
      },
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "No active exam found for this certification",
      });
    }

    // 2. Determine next attempt number
    const lastSession = await prisma.exam_sessions.findFirst({
      where: { exam_id: exam.exam_id, user_id },
      orderBy: { take: "desc" },
    });

    const nextTake = lastSession ? lastSession.take + 1 : 1;

    // 3. Create exam session
    const session = await prisma.exam_sessions.create({
      data: {
        exam_id: exam.exam_id,
        user_id,
        take: nextTake,
        status: "IN_PROGRESS",
        start_time: new Date(),
        last_activity_at: new Date(),
      },
    });

    // 4. Load exam questions
    const questions = await prisma.exam_questions.findMany({
      where: { exam_id: exam.exam_id, is_active: 1 },
      include: {
        questions: true, // Prisma relation name
      },
      orderBy: { order_index: "asc" },
    });

    return res.json({
      success: true,
      sessionId: session.id,
      examId: exam.exam_id,
      questions,
    });
  } catch (err) {
    console.error("❌ startByCertification ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
