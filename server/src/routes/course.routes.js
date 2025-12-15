const express = require("express");
const router = express.Router();
const courseCtrl = require("../controllers/course.controller");

router.get("/", courseCtrl.getAllCourses);
router.get("/:id", courseCtrl.getCourseById);
router.post("/add", courseCtrl.addCourse);
router.post("/update/:id", courseCtrl.updateCourse);
router.post("/delete/:id", courseCtrl.deleteCourse);

module.exports = router;
