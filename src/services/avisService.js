const pool = require('../config/db');

exports.createIfBought = async (clientId, ouvrageId, note, commentaire) => {
  // verify that client has a commande with this ouvrage
  const [rows] = await pool.execute(
    `SELECT ci.id FROM commande_items ci
     JOIN commandes c ON c.id = ci.commande_id
     WHERE c.client_id = ? AND ci.ouvrage_id = ?`,
    [clientId, ouvrageId]
  );
  if (!rows.length) throw new Error('No purchase found');
  // enforce unique avis per client/ouvrage by DB unique key or check
  await pool.execute('INSERT INTO avis (client_id, ouvrage_id, note, commentaire, date) VALUES (?, ?, ?, ?, NOW())', [clientId, ouvrageId, note, commentaire]);
  return { ok: true };
};