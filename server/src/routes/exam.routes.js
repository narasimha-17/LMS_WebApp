const express = require("express");
const router = express.Router();
const examCtrl = require("../controllers/exam.controller");

console.log("➡ exam.routes.js loaded");

// test route
router.get("/test", (req, res) => {
  res.json({ message: "Exam routes OK" });
});

// generate exam
router.post("/generate-auto", examCtrl.generateAutoBalancedExam);

// get exam questions
router.get("/:id/questions", examCtrl.getExamQuestions);

module.exports = router;
