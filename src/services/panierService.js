const pool = require('../config/db');

exports.getOrCreate = async (clientId) => {
  const [rows] = await pool.execute('SELECT * FROM panier WHERE client_id = ? AND actif = 1', [clientId]);
  if (rows.length) {
    const panier = rows[0];
    const [items] = await pool.execute('SELECT pi.id, pi.ouvrage_id, pi.quantite, pi.prix_unitaire, o.titre FROM panier_items pi JOIN ouvrages o ON o.id = pi.ouvrage_id WHERE pi.panier_id = ?', [panier.id]);
    panier.items = items;
    return panier;
  }
  const [res] = await pool.execute('INSERT INTO panier (client_id, actif) VALUES (?, ?)', [clientId, 1]);
  return { id: res.insertId, client_id: clientId, actif: 1, items: [] };
};

exports.addItem = async (clientId, { ouvrage_id, quantite }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // get or create panier
    const [p] = await conn.execute('SELECT * FROM panier WHERE client_id = ? AND actif = 1 FOR UPDATE', [clientId]);
    let panierId;
    if (p.length) panierId = p[0].id;
    else {
      const [r] = await conn.execute('INSERT INTO panier (client_id, actif) VALUES (?, ?)', [clientId, 1]);
      panierId = r.insertId;
    }
    // get price
    const [o] = await conn.execute('SELECT prix, stock FROM ouvrages WHERE id = ?', [ouvrage_id]);
    if (!o.length) throw new Error('Ouvrage introuvable');
    if (o[0].stock < 1) throw new Error('Stock insuffisant');
    const prix_unitaire = o[0].prix;
    // if item exists, increment quantity
    const [existing] = await conn.execute('SELECT id, quantite FROM panier_items WHERE panier_id = ? AND ouvrage_id = ?', [panierId, ouvrage_id]);
    if (existing.length) {
      const newQ = existing[0].quantite + quantite;
      await conn.execute('UPDATE panier_items SET quantite = ?, prix_unitaire = ? WHERE id = ?', [newQ, prix_unitaire, existing[0].id]);
      await conn.commit();
      return { id: existing[0].id, panier_id: panierId, ouvrage_id, quantite: newQ, prix_unitaire };
    } else {
      const [ri] = await conn.execute('INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)', [panierId, ouvrage_id, quantite, prix_unitaire]);
      await conn.commit();
      return { id: ri.insertId, panier_id: panierId, ouvrage_id, quantite, prix_unitaire };
    }
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.updateItem = async (clientId, itemId, quantite) => {
  // ensure item belongs to client's active panier
  const [rows] = await pool.execute('SELECT pi.* FROM panier_items pi JOIN panier p ON p.id = pi.panier_id WHERE pi.id = ? AND p.client_id = ? AND p.actif = 1', [itemId, clientId]);
  if (!rows.length) throw new Error('Item non trouvé');
  await pool.execute('UPDATE panier_items SET quantite = ? WHERE id = ?', [quantite, itemId]);
  const [updated] = await pool.execute('SELECT id, panier_id, ouvrage_id, quantite, prix_unitaire FROM panier_items WHERE id = ?', [itemId]);
  return updated[0];
};

exports.removeItem = async (clientId, itemId) => {
  const [rows] = await pool.execute('SELECT pi.id FROM panier_items pi JOIN panier p ON p.id = pi.panier_id WHERE pi.id = ? AND p.client_id = ? AND p.actif = 1', [itemId, clientId]);
  if (!rows.length) throw new Error('Item non trouvé');
  await pool.execute('DELETE FROM panier_items WHERE id = ?', [itemId]);
};