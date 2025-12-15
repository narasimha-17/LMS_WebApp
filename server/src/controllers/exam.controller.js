const pool = require("../prisma/db");

exports.generateAutoBalancedExam = async (req, res) => {
  const { exam_title = "Auto Exam" } = req.body;
  const TOTAL = 60;

  try {
    // Insert exam
    const [examResult] = await pool.query(
      `INSERT INTO exams (title, created_at) VALUES (?, NOW())`,
      [exam_title]
    );

    const exam_id = examResult.insertId;

    // Count difficulty
    const countDifficulty = async (level) => {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS count FROM questions 
         WHERE difficulty_level = ? AND status='Active'`,
        [level]
      );
      return rows[0].count || 0;
    };

    const available = {
      easy: await countDifficulty("easy"),
      medium: await countDifficulty("medium"),
      hard: await countDifficulty("hard"),
    };

    const target = { easy: 20, medium: 20, hard: 20 };

    let selected = {
      easy: Math.min(target.easy, available.easy),
      medium: Math.min(target.medium, available.medium),
      hard: Math.min(target.hard, available.hard),
    };

    let used = selected.easy + selected.medium + selected.hard;
    let remaining = TOTAL - used;

    const diffOrder = ["easy", "medium", "hard"];

    while (remaining > 0) {
      let changed = false;
      for (let d of diffOrder) {
        if (selected[d] < available[d]) {
          selected[d]++; 
          remaining--;
          changed = true;
          if (!remaining) break;
        }
      }
      if (!changed) break;
    }

    // Fetch questions
    const fetchQs = async (level, limit) => {
      const [rows] = await pool.query(
        `SELECT question_id FROM questions 
         WHERE difficulty_level = ? AND status='Active'
         ORDER BY RAND() 
         LIMIT ?`,
        [level, limit]
      );
      return rows;
    };

    const finalQs = [
      ...(await fetchQs("easy", selected.easy)),
      ...(await fetchQs("medium", selected.medium)),
      ...(await fetchQs("hard", selected.hard)),
    ];

    let order = 1;
    for (const q of finalQs) {
      await pool.query(
        `INSERT INTO exam_questions 
        (exam_id, question_id, order_index, created_at)
         VALUES (?, ?, ?, NOW())`,
        [exam_id, q.question_id, order++]
      );
    }

    res.json({
      success: true,
      exam_id,
      total_questions: finalQs.length,
      distribution: selected,
    });

  } catch (err) {
    console.error("Generate Exam Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getExamQuestions = async (req, res) => {
  const exam_id = req.params.id;

  try {
    const [rows] = await pool.query(
      `SELECT 
          q.question_id, 
          q.question_text,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_options AS correct_answer
       FROM exam_questions eq
       JOIN questions q ON eq.question_id = q.question_id
       WHERE eq.exam_id = ?
       ORDER BY eq.order_index ASC`,
      [exam_id]
    );

    res.json({ success: true, questions: rows });

  } catch (err) {
    console.error("Exam Questions Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
