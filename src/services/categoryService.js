const pool = require('../config/db');

exports.list = async () => {
  const [rows] = await pool.execute('SELECT id, nom, description FROM categories');
  return rows;
};

exports.create = async ({ nom, description }) => {
  const [res] = await pool.execute('INSERT INTO categories (nom, description) VALUES (?, ?)', [nom, description]);
  return { id: res.insertId, nom, description };
};

exports.update = async (id, { nom, description }) => {
  await pool.execute('UPDATE categories SET nom = ?, description = ? WHERE id = ?', [nom, description, id]);
  const [rows] = await pool.execute('SELECT id, nom, description FROM categories WHERE id = ?', [id]);
  return rows[0];
};

exports.remove = async (id) => {
  await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
};