const pool = require('../config/db');

exports.createCommande = async (clientId, items, adresse, mode_paiement) => {
  // items: [{ouvrage_id, quantite}]
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // lock and check stock
    for (const it of items) {
      const [rows] = await conn.execute('SELECT stock, prix FROM ouvrages WHERE id = ? FOR UPDATE', [it.ouvrage_id]);
      if (!rows.length) throw new Error('Ouvrage introuvable');
      if (rows[0].stock < it.quantite) throw new Error('Stock insuffisant');
      it.prix_unitaire = rows[0].prix;
    }
    // compute total
    let total = items.reduce((s, it) => s + (it.prix_unitaire * it.quantite), 0);
    // insert commande
    const [rc] = await conn.execute('INSERT INTO commandes (client_id, date, total, statut, adresse_livraison, mode_paiement, created_at, updated_at) VALUES (?, NOW(), ?, ?, ?, ?, NOW(), NOW())', [clientId, total, 'en_cours', adresse, mode_paiement]);
    const commandeId = rc.insertId;
    // insert items and update stock
    for (const it of items) {
      await conn.execute('INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)', [commandeId, it.ouvrage_id, it.quantite, it.prix_unitaire]);
      await conn.execute('UPDATE ouvrages SET stock = stock - ? WHERE id = ?', [it.quantite, it.ouvrage_id]);
    }
    // optionally: mark panier items inactive / clear panier
    await conn.commit();
    return commandeId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.listByClient = async (clientId) => {
  const [rows] = await pool.execute('SELECT * FROM commandes WHERE client_id = ? ORDER BY date DESC', [clientId]);
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM commandes WHERE id = ?', [id]);
  if (!rows.length) return null;
  const commande = rows[0];
  const [items] = await pool.execute('SELECT ci.id, ci.ouvrage_id, ci.quantite, ci.prix_unitaire FROM commande_items ci WHERE ci.commande_id = ?', [id]);
  commande.items = items;
  return commande;
};

exports.updateStatus = async (id, statut, userId) => {
  await pool.execute('UPDATE commandes SET statut = ?, updated_at = NOW() WHERE id = ?', [statut, id]);
  // optionally log who changed status in a history table
};