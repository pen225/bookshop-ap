const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

router.get('/me', auth, userController.me);
router.get('/', auth, role('administrateur'), userController.list);
router.put('/:id', auth, userController.update); // owner or admin check inside controller

module.exports = router;