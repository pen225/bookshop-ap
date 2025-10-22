const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async ({ nom, email, password }) => {
  const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
  const [result] = await pool.execute(
    'INSERT INTO users (nom, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [nom, email, hash, 'client']
  );
  return { id: result.insertId, nom, email };
};

exports.login = async ({ email, password }) => {
  const [rows] = await pool.execute('SELECT id, email, password_hash, nom, role FROM users WHERE email = ?', [email]);
  const user = rows[0];
  if (!user) throw new Error('Identifiants invalides');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error('Identifiants invalides');
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
  return { token, user: { id: user.id, nom: user.nom, email: user.email, role: user.role } };
};