const express = require('express');
const { body, param } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/avisController');
const router = express.Router();

router.post('/:ouvrageId/avis', authenticate, [
  param('ouvrageId').isInt({ gt: 0 }),
  body('note').isInt({ min: 1, max: 5 }),
  body('commentaire').optional().isString()
], validate, ctrl.addAvis);

module.exports = router;
