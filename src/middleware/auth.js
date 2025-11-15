const jwt = require('jsonwebtoken');
const pool = require('../config/db');

async function authenticate(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'Token manquant' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT id, nom, email, role, actif FROM users WHERE id = ?', [payload.id]);
    if (!rows.length) return res.status(401).json({ message: 'Utilisateur non trouvé' });
    if (!rows[0].actif) return res.status(403).json({ message: 'Compte désactivé' });
    req.user = rows[0];
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalide' });
  }
}

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Accès refusé' });
  next();
};

module.exports = { authenticate, authorizeRoles };
