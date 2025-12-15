const prisma = require("../prisma/client");

// LIST DOMAIN SCORES FOR ATTEMPT
exports.getByAttempt = async (req, res) => {
  try {
    const attemptId = Number(req.params.attemptId);

    const rows = await prisma.exam_result_domains.findMany({
      where: { attempt_id: attemptId },
      orderBy: { domain_name: "asc" }
    });

    res.json({ success: true, count: rows.length, data: rows });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch domain-wise results",
      error: err.message
    });
  }
};
