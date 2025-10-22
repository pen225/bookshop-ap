const pool = require('../config/db');

exports.list = async ({ query = {}, isAdmin = false } = {}) => {
  const page = parseInt(query.page || 1, 10);
  const limit = parseInt(query.limit || 20, 10);
  const offset = (page - 1) * limit;
  let sql = 'SELECT o.id, o.titre, o.auteur, o.isbn, o.description, o.prix, o.stock, o.categorie_id, o.created_at FROM ouvrages o';
  const params = [];
  if (!isAdmin) {
    sql += ' WHERE o.stock > 0';
  }
  sql += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);
  const [rows] = await pool.execute(sql, params);
  return { page, limit, data: rows };
};

exports.findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT o.id, o.titre, o.auteur, o.isbn, o.description, o.prix, o.stock, o.categorie_id, o.created_at 
     FROM ouvrages o WHERE id = ?`,
    [id]
  );
  if (!rows.length) return null;
  // load validated avis
  const [avis] = await pool.execute('SELECT id, client_id, note, commentaire, date FROM avis WHERE ouvrage_id = ?', [id]);
  rows[0].avis = avis;
  return rows[0];
};

exports.create = async ({ titre, auteur, isbn, description, prix, stock, categorie_id }) => {
  const [r] = await pool.execute(
    'INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [titre, auteur, isbn, description, prix, stock, categorie_id]
  );
  return this.findById(r.insertId);
};

exports.update = async (id, fields) => {
  const sets = [];
  const params = [];
  ['titre','auteur','isbn','description','prix','stock','categorie_id'].forEach(k => {
    if (typeof fields[k] !== 'undefined') {
      sets.push(`${k} = ?`);
      params.push(fields[k]);
    }
  });
  if (sets.length === 0) return this.findById(id);
  params.push(id);
  await pool.execute(`UPDATE ouvrages SET ${sets.join(', ')} WHERE id = ?`, params);
  return this.findById(id);
};

exports.remove = async (id) => {
  await pool.execute('DELETE FROM ouvrages WHERE id = ?', [id]);
};