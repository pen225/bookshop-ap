const pool = require('../config/db');

async function ensurePanier(clientId) {
  const [rows] = await pool.query('SELECT id FROM panier WHERE client_id = ? AND actif = TRUE', [clientId]);
  if (rows.length) return rows[0].id;
  const [r] = await pool.query('INSERT INTO panier (client_id, actif) VALUES (?, TRUE)', [clientId]);
  return r.insertId;
}

exports.getPanierActif = async (req, res, next) => {
  try {
    const pid = await ensurePanier(req.user.id);
    const [[pan]] = await pool.query('SELECT * FROM panier WHERE id = ?', [pid]);
    const [items] = await pool.query(
      'SELECT pi.*, o.titre FROM panier_items pi JOIN ouvrages o ON o.id = pi.ouvrage_id WHERE pi.panier_id = ?', [pid]
    );
    res.json({ panier: pan, items });
  } catch (e) { next(e); }
};

exports.addItem = async (req, res, next) => {
  try {
    const { ouvrage_id, quantite } = req.body;
    const pid = await ensurePanier(req.user.id);

    const [[ov]] = await pool.query('SELECT prix, stock FROM ouvrages WHERE id = ?', [ouvrage_id]);
    if (!ov) return res.status(404).json({ message: 'Ouvrage introuvable' });
    if (ov.stock < quantite) return res.status(400).json({ message: 'Stock insuffisant' });

    const [exist] = await pool.query('SELECT id, quantite FROM panier_items WHERE panier_id=? AND ouvrage_id=?', [pid, ouvrage_id]);
    if (exist.length) {
      await pool.query('UPDATE panier_items SET quantite = quantite + ? WHERE id = ?', [quantite, exist[0].id]);
    } else {
      await pool.query('INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (?,?,?,?)', [pid, ouvrage_id, quantite, ov.prix]);
    }
    res.status(201).json({ message: 'Ajouté' });
  } catch (e) { next(e); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantite } = req.body;
    if (quantite <= 0) {
      await pool.query('DELETE FROM panier_items WHERE id = ?', [id]);
      return res.json({ message: 'Supprimé' });
    }
    await pool.query('UPDATE panier_items SET quantite = ? WHERE id = ?', [quantite, id]);
    res.json({ message: 'OK' });
  } catch (e) { next(e); }
};

exports.removeItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM panier_items WHERE id = ?', [id]);
    res.json({ message: 'Supprimé' });
  } catch (e) { next(e); }
};
