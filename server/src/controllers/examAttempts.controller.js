const prisma = require('../prisma/client');

exports.create = async (req, res) => {
  try {
    const payload = req.body;
    const attempt = await prisma.exam_attempts.create({ data: payload });
    res.status(201).json({ success:true, data: attempt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error creating attempt', error: String(err) });
  }
};

exports.getBySession = async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10);
  try {
    const rows = await prisma.exam_attempts.findMany({
      where: { exam_session_id: sessionId },
      include: { exam_answers: true, exams: true }
    });
    res.json({ success:true, count: rows.length, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error fetching attempts' });
  }
};

exports.get = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const attempt = await prisma.exam_attempts.findUnique({ where: { attempt_id: id }, include: { exam_answers: true } });
    if (!attempt) return res.status(404).json({ success:false, message:'Attempt not found' });
    res.json({ success:true, data: attempt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error fetching attempt' });
  }
};
