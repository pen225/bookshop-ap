const pool = require('../config/db');

exports.create = async (clientId, ouvrageId, contenu) => {
  const [r] = await pool.execute('INSERT INTO commentaires (client_id, ouvrage_id, contenu, valide, date_soumission) VALUES (?, ?, ?, 0, NOW())', [clientId, ouvrageId, contenu]);
  return { id: r.insertId, client_id: clientId, ouvrage_id: ouvrageId, valide: false };
};

exports.validate = async (id, valideParId) => {
  await pool.execute('UPDATE commentaires SET valide = 1, date_validation = NOW(), valide_par = ? WHERE id = ?', [valideParId, id]);
};

exports.remove = async (id, userId) => {
  // allow owner or admin/editor to delete
  const [rows] = await pool.execute('SELECT client_id FROM commentaires WHERE id = ?', [id]);
  if (!rows.length) throw new Error('Not found');
  if (rows[0].client_id !== userId) {
    // check role of user (fetch)
    const [u] = await pool.execute('SELECT role FROM users WHERE id = ?', [userId]);
    if (!u.length || !['editeur','administrateur'].includes(u[0].role)) {
      throw new Error('Accès refusé');
    }
  }
  await pool.execute('DELETE FROM commentaires WHERE id = ?', [id]);
};