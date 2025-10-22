const { body } = require('express-validator');

exports.createCommentaire = [
  body('contenu').notEmpty().withMessage('Contenu requis'),
];