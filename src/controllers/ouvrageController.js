const ouvrageService = require('../services/ouvrageService');

exports.getAll = async (req, res, next) => {
  try {
    const isAdmin = req.user && req.user.role === 'administrateur';
    const opts = { query: req.query, isAdmin };
    const data = await ouvrageService.list(opts);
    res.json(data);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const o = await ouvrageService.findById(id);
    if (!o) return res.status(404).json({ error: 'Ouvrage introuvable' });
    res.json(o);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const created = await ouvrageService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'ISBN duplicata' });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await ouvrageService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await ouvrageService.remove(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};