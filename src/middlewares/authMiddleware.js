const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const h = req.headers['authorization'];
  if (!h) return res.status(401).json({ error: 'Token manquant' });
  const token = h.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};