const panierService = require('../services/panierService');

exports.getCurrent = async (req, res, next) => {
  try {
    const panier = await panierService.getOrCreate(req.user.id);
    res.json(panier);
  } catch (err) { next(err); }
};

exports.addItem = async (req, res, next) => {
  try {
    const item = await panierService.addItem(req.user.id, req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const item = await panierService.updateItem(req.user.id, Number(req.params.id), req.body.quantite);
    res.json(item);
  } catch (err) { next(err); }
};

exports.removeItem = async (req, res, next) => {
  try {
    await panierService.removeItem(req.user.id, Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
};