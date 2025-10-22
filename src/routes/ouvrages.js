const express = require('express');
const router = express.Router();
const ouvrageCtrl = require('../controllers/ouvrageController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateRequest');
const { createOuvrageValidator, updateOuvrageValidator, listQueryValidator } = require('../validators/ouvrageValidator');

router.get('/', listQueryValidator, validate, ouvrageCtrl.getAll);
router.get('/:id', ouvrageCtrl.getById);
router.post('/', auth, role('editeur','gestionnaire'), createOuvrageValidator, validate, ouvrageCtrl.create);
router.put('/:id', auth, role('editeur','gestionnaire'), updateOuvrageValidator, validate, ouvrageCtrl.update);
router.delete('/:id', auth, role('administrateur'), ouvrageCtrl.remove);

module.exports = router;