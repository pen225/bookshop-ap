const { body } = require('express-validator');

exports.createAvis = [
  body('note').isInt({ min: 1, max: 5 }).withMessage('Note 1..5'),
  body('commentaire').optional(),
];