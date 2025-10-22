const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateRequest');
const { createCommande } = require('../validators/commandeValidator');
const commandeCtrl = require('../controllers/commandeController');

router.use(auth);
router.post('/', createCommande, validate, commandeCtrl.create);
router.get('/', commandeCtrl.listForUser);
router.get('/:id', commandeCtrl.getById);
router.put('/:id/status', commandeCtrl.updateStatus); // admin/gestionnaire check inside

module.exports = router;