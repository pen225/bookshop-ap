const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateRequest');
const { createAvis } = require('../validators/avisValidator');
const avisCtrl = require('../controllers/avisController');

// creation d'avis pour ouvrage : POST /api/ouvrages/:id/avis
router.post('/:id/avis', auth, createAvis, validate, avisCtrl.create);

module.exports = router;