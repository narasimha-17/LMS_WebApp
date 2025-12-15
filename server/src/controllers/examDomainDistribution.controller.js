const prisma = require('../prisma/client');

exports.upsert = async (req, res) => {
  try {
    const { id, exam_id, domain_name } = req.body;
    if (id) {
      const updated = await prisma.exam_domain_distribution.update({
        where: { id: parseInt(id, 10) },
        data: req.body
      });
      return res.json({ success:true, data: updated });
    }
    const created = await prisma.exam_domain_distribution.create({ data: req.body });
    res.status(201).json({ success:true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error upserting distribution' });
  }
};

exports.getByExam = async (req, res) => {
  const examId = parseInt(req.params.examId, 10);
  try {
    const rows = await prisma.exam_domain_distribution.findMany({ where: { exam_id: examId } });
    res.json({ success:true, count: rows.length, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Error fetching distribution' });
  }
};
