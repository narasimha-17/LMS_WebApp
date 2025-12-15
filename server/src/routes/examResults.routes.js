const router = require("express").Router();
const ctrl = require("../controllers/examResults.controller");

// Debug route
router.get("/debug", (req, res) => {
  res.json({ route: "exam-results OK" });
});

// Routes
router.get("/", ctrl.list);
router.get("/attempt/:attemptId", ctrl.getByAttempt);
router.post("/", ctrl.create);

module.exports = router;
