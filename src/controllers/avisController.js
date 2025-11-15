const pool = require('../config/db');

exports.addAvis = async (req, res, next) => {
  try {
    const { ouvrageId } = req.params;
    const { note, commentaire } = req.body;
    const clientId = req.user.id;

    const [rows] = await pool.query(
      `SELECT 1 FROM commandes c JOIN commande_items ci ON ci.commande_id=c.id
       WHERE c.client_id=? AND ci.ouvrage_id=? LIMIT 1`, [clientId, ouvrageId]
    );
    if (!rows.length) return res.status(400).json({ message: 'Vous devez avoir acheté cet ouvrage pour laisser un avis.' });

    await pool.query(
      'INSERT INTO avis (client_id, ouvrage_id, note, commentaire) VALUES (?,?,?,?)       ON DUPLICATE KEY UPDATE note=VALUES(note), commentaire=VALUES(commentaire), date=NOW()',
      [clientId, ouvrageId, note, commentaire || null]
    );
    res.status(201).json({ message: 'Avis enregistré' });
  } catch (e) { next(e); }
};
