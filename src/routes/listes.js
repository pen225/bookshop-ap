const express = require('express');
const { body, param } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/listesController');
const router = express.Router();

router.post('/', authenticate, [ body('nom').notEmpty() ], validate, ctrl.createListe);
router.get('/:code', ctrl.getByCode);
router.post('/:id/acheter', authenticate, [ param('id').isInt({ gt: 0 }), body('ouvrage_id').isInt({ gt: 0 }), body('quantite').isInt({ gt: 0 }) ], validate, ctrl.acheterDepuisListe);

module.exports = router;
