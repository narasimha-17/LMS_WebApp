// controllers/exam.generator.controller.js
const prisma = require("../prisma/client");

async function getRandomQuestionsForDomain(domainId, count, certificationId = null) {
  // Use parameterized Prisma $queryRaw with RAND()
  if (certificationId) {
    return prisma.$queryRaw`
      SELECT *
      FROM questions
      WHERE domain_id = ${domainId}
        AND certification_id = ${certificationId}
        AND status = 'Active'
      ORDER BY RAND()
      LIMIT ${count};
    `;
  } else {
    return prisma.$queryRaw`
      SELECT *
      FROM questions
      WHERE domain_id = ${domainId}
        AND status = 'Active'
      ORDER BY RAND()
      LIMIT ${count};
    `;
  }
}

exports.generateRandomExam = async (req, res) => {
  const { title, certification_id, duration_minutes = 60, num_questions = 20, domain_distribution } = req.body;

  if (!title || !num_questions) return res.status(400).json({ error: "title and num_questions required" });

  try {
    // 1. Create exam entry
    const exam = await prisma.exams.create({
      data: {
        exam_title: title,
        certification_id: certification_id || null,
        duration_minutes,
        total_questions: num_questions,
        total_marks: 0, // we'll compute after insertion
        is_randomized: 1,
        status: "Active",
      }
    });

    let selectedQuestions = [];

    if (Array.isArray(domain_distribution) && domain_distribution.length > 0) {
      // domain_distribution: [{ domain_id: 1, num_questions: 5 }, ...]
      for (const dd of domain_distribution) {
        const domainQuestions = await getRandomQuestionsForDomain(dd.domain_id, dd.num_questions, certification_id);
        selectedQuestions = selectedQuestions.concat(domainQuestions);
      }
    } else {
      // pick num_questions randomly from certification if provided, otherwise any active
      if (certification_id) {
        const qs = await prisma.$queryRaw`
          SELECT *
          FROM questions
          WHERE certification_id = ${Number(certification_id)}
            AND status = 'Active'
          ORDER BY RAND()
          LIMIT ${Number(num_questions)};
        `;
        selectedQuestions = qs;
      } else {
        const qs = await prisma.$queryRaw`
          SELECT *
          FROM questions
          WHERE status = 'Active'
          ORDER BY RAND()
          LIMIT ${Number(num_questions)};
        `;
        selectedQuestions = qs;
      }
    }

    if (!selectedQuestions || selectedQuestions.length === 0) {
      return res.status(400).json({ error: "Not enough questions available to generate the exam" });
    }

    // 3. Map to exam_questions rows
    const examQuestionRows = selectedQuestions.map((q, idx) => ({
      exam_id: exam.exam_id,
      question_id: q.question_id,
      order_index: idx + 1,
      is_mandatory: 0,
      time_limit_seconds: q.time_limit_seconds || null,
      marks: q.marks || 1,
      negative_marks: q.negative_marks || 0,
      points_weight: q.points_weight || 1,
      show_explanation_on_submit: 0,
      cloned_from_question_id: q.question_id,
      tag_snapshot: q.tags ? q.tags.join(",") : null,
      is_active: 1,
      expected_time_seconds: q.expected_time_seconds || null,
    }));

    // Bulk insert
    await prisma.exam_questions.createMany({ data: examQuestionRows });

    // Update total_marks on exam (sum of marks)
    const totalMarks = examQuestionRows.reduce((s, r) => s + (r.marks || 0), 0);
    await prisma.exams.update({ where: { exam_id: exam.exam_id }, data: { total_marks: totalMarks } });

    return res.json({ success: true, message: "Random exam generated", exam_id: exam.exam_id, total_questions: selectedQuestions.length });
  } catch (err) {
    console.error("❌ generateRandomExam error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
