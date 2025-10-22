const { body, param } = require('express-validator');

exports.addItem = [
  body('ouvrage_id').isInt().withMessage('ouvrage_id invalide'),
  body('quantite').isInt({ min: 1 }).withMessage('quantite invalide'),
];

exports.updateItem = [
  param('id').isInt().withMessage('item id invalide'),
  body('quantite').isInt({ min: 1 }).withMessage('quantite invalide'),
];