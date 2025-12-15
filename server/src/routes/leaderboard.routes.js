const express = require("express");
const router = express.Router();
const leaderboardCtrl = require("../controllers/leaderboard.controller");

router.get("/", leaderboardCtrl.getLeaderboard);

module.exports = router;
