const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validateRequest');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const authController = require('../controllers/authController');

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);

module.exports = router;