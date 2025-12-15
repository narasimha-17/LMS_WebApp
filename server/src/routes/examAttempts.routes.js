const router = require('express').Router();
const ctrl = require('../controllers/examAttempts.controller');

router.post('/', ctrl.create);
router.get('/session/:sessionId', ctrl.getBySession);
router.get('/:id', ctrl.get);

module.exports = router;
