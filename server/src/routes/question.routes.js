const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/question.controller");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);      // <-- FIXED
router.delete("/:id", ctrl.remove);   // <-- FIXED

module.exports = router;
