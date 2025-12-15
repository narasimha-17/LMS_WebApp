const pool = require("../prisma/db");

exports.getLeaderboard = async (req, res) => {
  try {
  const [rows] = await pool.query(`
  SELECT 
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS name,
    u.email,
    MAX(er.percentage) AS best_score,
    COUNT(er.result_id) AS exams_taken
  FROM exam_results er
  JOIN users u ON er.user_id = u.user_id
  GROUP BY er.user_id
  ORDER BY best_score DESC;
`);

    res.json({ success: true, data: rows });

  } catch (err) {
    console.error("Leaderboard Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
