const pool = require('../config/db');

exports.listPublic = async (req, res, next) => {
  try {
    const { q, categorie } = req.query;
    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 20, 10);
    const offset = (page - 1) * limit;

    let sql = 'SELECT o.*, c.nom AS categorie FROM ouvrages o LEFT JOIN categories c ON c.id=o.categorie_id WHERE o.stock > 0';
    const params = [];
    if (q) { sql += ' AND (o.titre LIKE ? OR o.auteur LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
    if (categorie) { sql += ' AND o.categorie_id = ?'; params.push(categorie); }
    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [rows] = await pool.query(sql, params);
    res.json({ page, limit, data: rows });
  } catch (e) { next(e); }
};

exports.detail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM ouvrages WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Introuvable' });
    const [avis] = await pool.query('SELECT note, commentaire, date, client_id FROM avis WHERE ouvrage_id = ?', [id]);
    res.json({ ...rows[0], avis });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { titre, auteur, isbn, description, prix, stock, categorie_id } = req.body;
    const [r] = await pool.query(
      'INSERT INTO ouvrages (titre,auteur,isbn,description,prix,stock,categorie_id) VALUES (?,?,?,?,?,?,?)',
      [titre, auteur || null, isbn || null, description || null, prix, stock, categorie_id || null]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titre, auteur, isbn, description, prix, stock, categorie_id } = req.body;
    await pool.query(
      'UPDATE ouvrages SET titre=COALESCE(?,titre), auteur=COALESCE(?,auteur), isbn=COALESCE(?,isbn), description=COALESCE(?,description), prix=COALESCE(?,prix), stock=COALESCE(?,stock), categorie_id=COALESCE(?,categorie_id) WHERE id=?',
      [titre, auteur, isbn, description, prix, stock, categorie_id, id]
    );
    res.json({ message: 'OK' });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM ouvrages WHERE id = ?', [id]);
    res.json({ message: 'Supprimé' });
  } catch (e) { next(e); }
};
