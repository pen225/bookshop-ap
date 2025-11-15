const pool = require('../config/db');
const { randomUUID } = require('crypto');

exports.createListe = async (req, res, next) => {
  try {
    const code = randomUUID();
    const { nom } = req.body;
    const [r] = await pool.query('INSERT INTO listes_cadeaux (nom, proprietaire_id, code_partage) VALUES (?,?,?)', [nom, req.user.id, code]);
    res.status(201).json({ id: r.insertId, code_partage: code });
  } catch (e) { next(e); }
};

exports.getByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const [[liste]] = await pool.query('SELECT * FROM listes_cadeaux WHERE code_partage = ?', [code]);
    if (!liste) return res.status(404).json({ message: 'Introuvable' });
    const [items] = await pool.query('SELECT li.*, o.titre FROM liste_items li JOIN ouvrages o ON o.id=li.ouvrage_id WHERE li.liste_id=?', [liste.id]);
    res.json({ ...liste, items });
  } catch (e) { next(e); }
};

exports.acheterDepuisListe = async (req, res, next) => {
  const cnx = await pool.getConnection();
  try {
    await cnx.beginTransaction();
    const { id } = req.params;
    const { ouvrage_id, quantite } = req.body;

    const [[li]] = await cnx.query('SELECT quantite_souhaitee FROM liste_items WHERE liste_id=? AND ouvrage_id=? FOR UPDATE', [id, ouvrage_id]);
    if (!li) throw { status: 404, message: 'Item de liste introuvable' };

    const [[ov]] = await cnx.query('SELECT prix, stock FROM ouvrages WHERE id=? FOR UPDATE', [ouvrage_id]);
    if (!ov || ov.stock < quantite) throw { status: 400, message: 'Stock insuffisant' };

    await cnx.query('UPDATE ouvrages SET stock = stock - ? WHERE id=?', [quantite, ouvrage_id]);
    await cnx.commit();
    res.json({ message: 'Achat simulé', montant: parseFloat(ov.prix) * quantite });
  } catch (e) {
    await cnx.rollback();
    if (e.status) return res.status(e.status).json({ message: e.message });
    next(e);
  } finally { cnx.release(); }
};
