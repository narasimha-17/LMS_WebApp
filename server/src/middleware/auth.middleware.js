const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Place user in req.user
    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    };

    next(); // allow request to continue
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
