const router = require('express').Router();
const ctrl = require('../controllers/examDomainDistribution.controller');

router.post('/', ctrl.upsert);
router.get('/exam/:examId', ctrl.getByExam);

module.exports = router;
