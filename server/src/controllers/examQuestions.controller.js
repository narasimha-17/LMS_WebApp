const prisma = require('../prisma/client');

exports.create = async (req, res) => {
  try {
    const payload = req.body;
    const created = await prisma.exam_questions.create({ data: payload });
    res.status(201).json({ success:true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error creating exam question', error: String(err) });
  }
};

exports.listByExam = async (req, res) => {
  const examId = parseInt(req.params.examId, 10);
  try {
    const rows = await prisma.exam_questions.findMany({
      where: { exam_id: examId },
      orderBy: { order_index: 'asc' }
    });
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error fetching questions' });
  }
};

exports.get = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const q = await prisma.exam_questions.findUnique({ where: { exam_question_id: id } });
    if (!q) return res.status(404).json({ success:false, message:'Question not found' });
    res.json({ success:true, data: q });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error fetching question' });
  }
};

exports.update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const updated = await prisma.exam_questions.update({ where: { exam_question_id: id }, data: req.body });
    res.json({ success:true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error updating question' });
  }
};

exports.remove = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.exam_questions.delete({ where: { exam_question_id: id } });
    res.json({ success:true, message:'Deleted question' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error deleting question' });
  }
};
