const pool = require('../config/db');

exports.addCommentaire = async (req, res, next) => {
  try {
    const { ouvrage_id, contenu } = req.body;
    const [r] = await pool.query(
      'INSERT INTO commentaires (client_id, ouvrage_id, contenu) VALUES (?,?,?)',
      [req.user.id, ouvrage_id, contenu]
    );
    res.status(201).json({ id: r.insertId, valide: 0 });
  } catch (e) { next(e); }
};

exports.valider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { valide } = req.body;
    await pool.query(
      'UPDATE commentaires SET valide=?, date_validation=IF(?=1, NOW(), NULL), valide_par=? WHERE id=?',
      [valide ? 1 : 0, valide ? 1 : 0, req.user.id, id]
    );
    res.json({ message: 'OK' });
  } catch (e) { next(e); }
};
