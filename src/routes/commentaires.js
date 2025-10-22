const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateRequest');
const { createCommentaire } = require('../validators/commentaireValidator');
const commentaireCtrl = require('../controllers/commentaireController');

router.post('/', auth, createCommentaire, validate, commentaireCtrl.create);
router.put('/:id/valider', auth, role('editeur'), commentaireCtrl.validateComment);
router.delete('/:id', auth, commentaireCtrl.remove);

module.exports = router;