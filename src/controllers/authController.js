const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { nom, email, password } = req.body;
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(400).json({ message: 'Email déjà utilisé' });
    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query('INSERT INTO users (nom,email,password_hash) VALUES (?,?,?)', [nom, email, hash]);
    const token = jwt.sign({ id: r.insertId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(201).json({ token });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT id, password_hash, actif FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Crédentiels invalides' });
    const user = rows[0];
    if (!user.actif) return res.status(403).json({ message: 'Compte désactivé' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Crédentiels invalides' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token });
  } catch (e) { next(e); }
};
