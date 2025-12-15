const pool = require("../prisma/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* -------------------------------------------
   ROLE-BASED ACCESS WITHOUT DB COLUMN
-------------------------------------------- */

// Admins
const ADMIN_EMAILS = ["admin@gmail.com"];

// Instructors
const INSTRUCTOR_EMAILS = ["instructor@gmail.com", "teacher@gmail.com"];

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY";

/* -------------------------------------------
   REGISTER
-------------------------------------------- */
exports.register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users 
       (first_name, last_name, email, password_hash, status_active) 
       VALUES (?, ?, ?, ?, 'active')`,
      [first_name, last_name, email, hashed]
    );

    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* -------------------------------------------
   LOGIN (COOKIE + ROLE)
-------------------------------------------- */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    /* -------- ROLE DETECTION -------- */
    let role = "student";
    if (ADMIN_EMAILS.includes(email)) role = "admin";
    else if (INSTRUCTOR_EMAILS.includes(email)) role = "instructor";

    /* -------- JWT -------- */
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    /* -------- COOKIE (IMPORTANT) -------- */
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax", // REQUIRED for localhost cross-origin
        secure: false,    // true only in HTTPS
        path: "/",
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role,
        },
      });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* -------------------------------------------
   LOGOUT
-------------------------------------------- */
exports.logout = async (req, res) => {
  res
    .clearCookie("token", { path: "/" })
    .json({ success: true, message: "Logged out" });
};
