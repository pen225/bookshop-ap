const pool = require('../config/db');

exports.findById = async (id) => {
  const [rows] = await pool.execute('SELECT id, nom, email, role, actif, created_at, updated_at FROM users WHERE id = ?', [id]);
  return rows[0];
};

exports.listAll = async () => {
  const [rows] = await pool.execute('SELECT id, nom, email, role, actif, created_at FROM users');
  return rows;
};

exports.update = async (id, data) => {
  const fields = [];
  const values = [];
  if (data.nom) { fields.push('nom = ?'); values.push(data.nom); }
  if (data.email) { fields.push('email = ?'); values.push(data.email); }
  if (typeof data.actif !== 'undefined') { fields.push('actif = ?'); values.push(data.actif); }
  if (fields.length === 0) return this.findById(id);
  values.push(id);
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  await pool.execute(sql, values);
  return this.findById(id);
};