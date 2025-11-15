const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  body('nom').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], validate, ctrl.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], validate, ctrl.login);

module.exports = router;
