const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const ctrl = require('../controllers/categoriesController');
const router = express.Router();

router.get('/', ctrl.list);
router.post('/', authenticate, authorizeRoles('editeur','gestionnaire','administrateur'), [ body('nom').notEmpty() ], validate, ctrl.create);
router.put('/:id', authenticate, authorizeRoles('editeur','gestionnaire','administrateur'), [ body('nom').optional().notEmpty() ], validate, ctrl.update);
router.delete('/:id', authenticate, authorizeRoles('gestionnaire','administrateur'), ctrl.remove);

module.exports = router;
