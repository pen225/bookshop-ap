const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateRequest');
const { addItem, updateItem } = require('../validators/panierValidator');
const panierCtrl = require('../controllers/panierController');

router.use(auth);
router.get('/', panierCtrl.getCurrent);
router.post('/items', addItem, validate, panierCtrl.addItem);
router.put('/items/:id', updateItem, validate, panierCtrl.updateItem);
router.delete('/items/:id', panierCtrl.removeItem);

module.exports = router;