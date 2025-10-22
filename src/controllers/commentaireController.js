const commentaireService = require('../services/commentaireService');

exports.create = async (req, res, next) => {
  try {
    const clientId = req.user.id;
    const { ouvrage_id, contenu } = req.body;
    const c = await commentaireService.create(clientId, ouvrage_id, contenu);
    res.status(201).json(c);
  } catch (err) { next(err); }
};

exports.validateComment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await commentaireService.validate(id, req.user.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await commentaireService.remove(id, req.user.id);
    res.status(204).send();
  } catch (err) { next(err); }
};