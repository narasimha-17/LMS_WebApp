const pool = require("../prisma/db");

exports.getAllCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cert.certification_name 
      FROM courses c
      LEFT JOIN certifications cert ON c.certification_id = cert.id
      WHERE c.status_active = 'active'
      ORDER BY c.course_id DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM courses WHERE course_id = ? LIMIT 1`,
      [req.params.id]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.json({ success: false });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const {
      provider_id,
      certification_id,
      price,
      language,
      videos,
      sheets,
      extra,
      created_by
    } = req.body;

    await pool.query(
      `INSERT INTO courses 
      (provider_id, certification_id, price, language, videos, sheets, extra, 
        status_active, active_date, status_publish, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW(), 'unpublished', ?, NOW())`,
      [
        provider_id,
        certification_id,
        price,
        language,
        videos,
        sheets,
        extra,
        created_by,
      ]
    );

    res.json({ success: true, message: "Course added!" });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { price, language, videos, sheets, extra } = req.body;

    await pool.query(
      `UPDATE courses SET 
        price=?, language=?, videos=?, sheets=?, extra=?, updated_at=NOW()
      WHERE course_id = ?`,
      [price, language, videos, sheets, extra, req.params.id]
    );

    res.json({ success: true, message: "Course updated!" });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await pool.query(
      `UPDATE courses SET status_active='inactive', inactive_date=NOW() 
       WHERE course_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, message: "Course removed!" });
  } catch (err) {
    res.json({ success: false });
  }
};
