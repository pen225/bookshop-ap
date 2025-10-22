const pool = require('../config/db');
const commandeService = require('./commandeService');

exports.create = async (ownerId, { nom, items }) => {
  const code = Math.random().toString(36).slice(2, 9);
  const [r] = await pool.execute('INSERT INTO listes_cadeaux (nom, proprietaire_id, code_partage, date_creation) VALUES (?, ?, ?, NOW())', [nom, ownerId, code]);
  const id = r.insertId;
  if (Array.isArray(items)) {
    for (const it of items) {
      await pool.execute('INSERT INTO liste_items (liste_id, ouvrage_id, quantite_souhaitee) VALUES (?, ?, ?)', [id, it.ouvrage_id, it.quantite || 1]);
    }
  }
  return { id, nom, code_partage: code };
};

exports.findByCode = async (code) => {
  const [rows] = await pool.execute('SELECT * FROM listes_cadeaux WHERE code_partage = ?', [code]);
  if (!rows.length) return null;
  const liste = rows[0];
  const [items] = await pool.execute('SELECT li.id, li.ouvrage_id, li.quantite_souhaitee, o.titre FROM liste_items li JOIN ouvrages o ON o.id = li.ouvrage_id WHERE li.liste_id = ?', [liste.id]);
  liste.items = items;
  return liste;
};

exports.acheter = async (clientId, listeId) => {
  const [items] = await pool.execute('SELECT ouvrage_id, quantite_souhaitee FROM liste_items WHERE liste_id = ?', [listeId]);
  if (!items.length) throw new Error('Liste vide');
  const orderItems = items.map(i => ({ ouvrage_id: i.ouvrage_id, quantite: i.quantite_souhaitee }));
  const commandeId = await commandeService.createCommande(clientId, orderItems, 'A définir', 'liste_cadeau');
  return commandeId;
};