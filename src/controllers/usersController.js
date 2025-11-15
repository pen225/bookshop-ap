const pool = require('../config/db');

exports.me = async (req, res, next) => {
  res.json({ id: req.user.id, nom: req.user.nom, email: req.user.email, role: req.user.role });
};

exports.list = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, nom, email, role, actif, created_at FROM users');
    res.json(rows);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'administrateur' && req.user.id != id) {
      return res.status(403).json({ message: 'Interdit' });
    }
    const { nom, role, actif } = req.body;
    const fields = [];
    const params = [];
    if (nom !== undefined) { fields.push('nom = ?'); params.push(nom); }
    if (role !== undefined && req.user.role === 'administrateur') { fields.push('role = ?'); params.push(role); }
    if (actif !== undefined && req.user.role === 'administrateur') { fields.push('actif = ?'); params.push(!!actif); }
    if (!fields.length) return res.status(400).json({ message: 'Aucune donnée' });
    params.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Mis à jour' });
  } catch (e) { next(e); }
};
