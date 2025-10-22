const { body } = require('express-validator');

exports.createCommande = [
  body('adresse_livraison').notEmpty().withMessage('Adresse requise'),
  body('items').isArray({ min: 1 }).withMessage('Items requis'),
  body('items.*.ouvrage_id').isInt().withMessage('ouvrage_id invalide'),
  body('items.*.quantite').isInt({ min: 1 }).withMessage('quantite invalide'),
];