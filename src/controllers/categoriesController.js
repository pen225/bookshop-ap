const pool = require('../config/db');

exports.list = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY nom');
    res.json(rows);
  } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try {
    const { nom, description } = req.body;
    const [r] = await pool.query('INSERT INTO categories (nom,description) VALUES (?,?)', [nom, description || null]);
    res.status(201).json({ id: r.insertId, nom, description });
  } catch (e) { next(e); }
};
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom, description } = req.body;
    await pool.query('UPDATE categories SET nom = COALESCE(?, nom), description = COALESCE(?, description) WHERE id = ?', [nom, description, id]);
    res.json({ message: 'OK' });
  } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Supprimé' });
  } catch (e) { next(e); }
};
