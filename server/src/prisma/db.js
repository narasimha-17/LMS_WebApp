const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root12345",
  port: process.env.DB_PORT || 3307,
  database: process.env.DB_NAME || "lms_narasimha",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
