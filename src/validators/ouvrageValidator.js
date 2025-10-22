const { body, param, query } = require('express-validator');

exports.createOuvrageValidator = [
  body('titre').notEmpty().withMessage('Titre requis'),
  body('prix').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('stock').isInt({ min: 0 }).withMessage('Stock invalide'),
  body('categorie_id').isInt().withMessage('categorie_id requis'),
];

exports.updateOuvrageValidator = [
  param('id').isInt().withMessage('ID invalide'),
  body('titre').optional().notEmpty(),
  body('prix').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
];

exports.listQueryValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1 }),
];