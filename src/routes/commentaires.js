const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/commentairesController');
const router = express.Router();

router.post('/', authenticate, [
  body('ouvrage_id').isInt({ gt: 0 }),
  body('contenu').isString().notEmpty()
], validate, ctrl.addCommentaire);

router.put('/:id/valider', authenticate, authorizeRoles('editeur','administrateur'), [
  param('id').isInt({ gt: 0 }),
  body('valide').isBoolean()
], validate, ctrl.valider);

module.exports = router;
