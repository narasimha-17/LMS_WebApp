const pool = require("../prisma/db");

/* GET ALL QUESTIONS */
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM questions ORDER BY question_id ASC"
    );

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    res.status(500).json({ success: false, message: "Failed to fetch questions" });
  }
};

/* GET ONE QUESTION BY ID */
exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: "Invalid id" });

  try {
    const [rows] = await pool.query("SELECT * FROM questions WHERE question_id = ?", [id]);

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Question not found" });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("❌ Error fetching question:", err);
    res.status(500).json({ success: false });
  }
};

/* CREATE QUESTION */
exports.create = async (req, res) => {
  const { question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;

  if (!question_text || !correct_answer)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const [result] = await pool.query(
      `INSERT INTO questions 
       (question_text, option_a, option_b, option_c, option_d, correct_answer)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [question_text, option_a, option_b, option_c, option_d, correct_answer]
    );

    res.json({ success: true, question_id: result.insertId });
  } catch (err) {
    console.error("❌ Error creating question:", err);
    res.status(500).json({ success: false });
  }
};

/* UPDATE QUESTION */
exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;

  try {
    await pool.query(
      `UPDATE questions SET 
        question_text=?, option_a=?, option_b=?, option_c=?, option_d=?, correct_answer=?
       WHERE question_id=?`,
      [question_text, option_a, option_b, option_c, option_d, correct_answer, id]
    );

    res.json({ success: true, message: "Question updated" });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ success: false });
  }
};

/* DELETE QUESTION */
exports.remove = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await pool.query("DELETE FROM questions WHERE question_id = ?", [id]);
    res.json({ success: true, message: "Question deleted" });
  } catch (err) {
    console.error("❌ Error deleting question:", err);
    res.status(500).json({ success: false });
  }
};
