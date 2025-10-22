const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.get('/', categoryController.list);
router.post('/', auth, role('editeur', 'gestionnaire'), categoryController.create);
router.put('/:id', auth, role('editeur', 'gestionnaire'), categoryController.update);
router.delete('/:id', auth, role('administrateur'), categoryController.remove);

module.exports = router;