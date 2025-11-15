const express = require('express');
const { body, param } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/panierController');
const router = express.Router();

router.get('/', authenticate, ctrl.getPanierActif);
router.post('/items', authenticate, [
  body('ouvrage_id').isInt({ gt: 0 }),
  body('quantite').isInt({ gt: 0 })
], validate, ctrl.addItem);
router.put('/items/:id', authenticate, [ param('id').isInt({ gt: 0 }), body('quantite').isInt({ gt: 0 }) ], validate, ctrl.updateItem);
router.delete('/items/:id', authenticate, [ param('id').isInt({ gt: 0 }) ], validate, ctrl.removeItem);

module.exports = router;
