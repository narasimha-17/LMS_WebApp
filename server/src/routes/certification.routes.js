const express = require("express");
const router = express.Router();
const pool = require("../prisma/db");

// GET ALL CERTIFICATIONS
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        certification_id AS id,
        certification_name AS title,
        certification_level AS badge,
        certification_image_path AS image
      FROM certification
      ORDER BY certification_id ASC;
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Error fetching certifications:", err);
    res.status(500).json({ success: false, message: "Failed to fetch certifications" });
  }
});


// ✅ GET ONLY CERTIFICATION DETAILS (NO TESTS)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // GET certification
    const [[cert]] = await pool.query(
      `
      SELECT 
        certification_id AS id,
        certification_name,
        certification_description,
        certification_image_path,
        certification_level,
        certification_code
        
      FROM certification
      WHERE certification_id = ?;
      `,
      [id]
    );

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    // GET the exam linked to this certification
    let exam = null;
    if (cert.exam_id) {
      const [examRows] = await pool.query(
        `
        SELECT * FROM exams WHERE exam_id = ?;
        `,
        [cert.exam_id]
      );
      exam = examRows[0] || null;
    }

    res.json({
      success: true,
      data: {
        ...cert,
        exam,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching CERT details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certification details",
    });
  }
});

module.exports = router;
