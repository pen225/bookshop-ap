const express = require('express');
const { body, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const ctrl = require('../controllers/ouvragesController');
const router = express.Router();

router.get('/', [
  query('q').optional().isString(),
  query('categorie').optional().isInt({ gt: 0 }),
  query('page').optional().isInt({ gt: 0 }),
  query('limit').optional().isInt({ gt: 0 })
], validate, ctrl.listPublic);

router.get('/:id', ctrl.detail);

router.post('/', authenticate, authorizeRoles('editeur','gestionnaire','administrateur'), [
  body('titre').notEmpty(),
  body('prix').isFloat({ gt: -0.01 }),
  body('stock').isInt({ min: 0 })
], validate, ctrl.create);

router.put('/:id', authenticate, authorizeRoles('editeur','gestionnaire','administrateur'), [
  body('prix').optional().isFloat({ gt: -0.01 }),
  body('stock').optional().isInt({ min: 0 })
], validate, ctrl.update);

router.delete('/:id', authenticate, authorizeRoles('gestionnaire','administrateur'), ctrl.remove);

module.exports = router;
