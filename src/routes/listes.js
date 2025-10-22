const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const listeCtrl = require('../controllers/listeController');

router.post('/', auth, listeCtrl.create);
router.get('/:code', listeCtrl.getByCode);
router.post('/:id/acheter', auth, listeCtrl.acheter);

module.exports = router;