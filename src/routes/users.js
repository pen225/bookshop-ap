const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const ctrl = require('../controllers/usersController');
const router = express.Router();

router.get('/me', authenticate, ctrl.me);
router.get('/', authenticate, authorizeRoles('administrateur'), ctrl.list);
router.put('/:id', authenticate, ctrl.update);

module.exports = router;
