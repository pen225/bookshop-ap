const listeService = require('../services/listeService');

exports.create = async (req, res, next) => {
  try {
    const l = await listeService.create(req.user.id, req.body);
    res.status(201).json(l);
  } catch (err) { next(err); }
};

exports.getByCode = async (req, res, next) => {
  try {
    const code = req.params.code;
    const l = await listeService.findByCode(code);
    if (!l) return res.status(404).json({ error: 'Liste introuvable' });
    res.json(l);
  } catch (err) { next(err); }
};

exports.acheter = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    // simplified: create commande from liste items
    const commandeId = await listeService.acheter(req.user.id, id);
    res.json({ commandeId });
  } catch (err) { next(err); }
};