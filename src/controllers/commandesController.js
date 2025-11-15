const pool = require('../config/db');

exports.createCommande = async (req, res, next) => {
  const cnx = await pool.getConnection();
  try {
    await cnx.beginTransaction();
    const clientId = req.user.id;
    const useBodyItems = Array.isArray(req.body.items) && req.body.items.length > 0;
    let items = [];

    if (useBodyItems) {
      items = req.body.items;
    } else {
      const [pidRows] = await cnx.query('SELECT id FROM panier WHERE client_id=? AND actif=TRUE', [clientId]);
      if (!pidRows.length) throw { status: 400, message: 'Aucun panier actif' };
      const panierId = pidRows[0].id;
      const [rows] = await cnx.query('SELECT ouvrage_id, quantite, prix_unitaire FROM panier_items WHERE panier_id=?', [panierId]);
      if (!rows.length) throw { status: 400, message: 'Panier vide' };
      items = rows.map(r => ({ ouvrage_id: r.ouvrage_id, quantite: r.quantite, prix_unitaire: r.prix_unitaire }));
    }

    let total = 0;
    for (const it of items) {
      const [rows] = await cnx.query('SELECT id, prix, stock, titre FROM ouvrages WHERE id=? FOR UPDATE', [it.ouvrage_id]);
      if (!rows.length) throw { status: 400, message: `Ouvrage introuvable ${it.ouvrage_id}` };
      const ov = rows[0];
      if (ov.stock < it.quantite) throw { status: 400, message: `Stock insuffisant pour ${ov.titre}` };
      total += (it.prix_unitaire ?? parseFloat(ov.prix)) * it.quantite;
    }

    const adresse = req.body.adresse_livraison || 'non précisée';
    const mode_paiement = req.body.mode_paiement || 'simulation';

    const [rCmd] = await cnx.query(
      'INSERT INTO commandes (client_id,total,adresse_livraison,mode_paiement,statut) VALUES (?,?,?,?,?)',
      [clientId, total.toFixed(2), adresse, mode_paiement, 'en_cours']
    );
    const commandeId = rCmd.insertId;

    for (const it of items) {
      const [[ov]] = await cnx.query('SELECT prix FROM ouvrages WHERE id=? FOR UPDATE', [it.ouvrage_id]);
      const unit = it.prix_unitaire ?? ov.prix;
      await cnx.query('INSERT INTO commande_items (commande_id,ouvrage_id,quantite,prix_unitaire) VALUES (?,?,?,?)', [commandeId, it.ouvrage_id, it.quantite, unit]);
      await cnx.query('UPDATE ouvrages SET stock = stock - ? WHERE id = ?', [it.quantite, it.ouvrage_id]);
    }

    await cnx.query('UPDATE panier SET actif = FALSE WHERE client_id=? AND actif=TRUE', [clientId]);

    await cnx.commit();
    res.status(201).json({ commandeId, total: parseFloat(total.toFixed(2)) });
  } catch (e) {
    await cnx.rollback();
    if (e.status) return res.status(e.status).json({ message: e.message });
    next(e);
  } finally { cnx.release(); }
};

exports.listMy = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM commandes WHERE client_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (e) { next(e); }
};

exports.detailMy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[cmd]] = await pool.query('SELECT * FROM commandes WHERE id = ? AND client_id = ?', [id, req.user.id]);
    if (!cmd) return res.status(404).json({ message: 'Introuvable' });
    const [items] = await pool.query('SELECT * FROM commande_items WHERE commande_id = ?', [id]);
    res.json({ ...cmd, items });
  } catch (e) { next(e); }
};
