const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/commandesController');
const router = express.Router();

router.post('/', authenticate, [
  body('items').optional().isArray({ min: 1 }),
  body('adresse_livraison').optional().isString(),
  body('mode_paiement').optional().isString()
], validate, ctrl.createCommande);

router.get('/', authenticate, ctrl.listMy);
router.get('/:id', authenticate, ctrl.detailMy);

module.exports = router;
