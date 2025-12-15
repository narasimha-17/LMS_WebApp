const router = require("express").Router();
const ctrl = require("../controllers/examResultDomains.controller");

router.get("/attempt/:attemptId", ctrl.getByAttempt);

router.get("/debug", (req, res) => res.json({ route: "exam-result-domains OK" }));

module.exports = router;
