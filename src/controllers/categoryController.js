const categoryService = require('../services/categoryService');

exports.list = async (req, res, next) => {
  try {
    const cats = await categoryService.list();
    res.json(cats);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const c = await categoryService.create(req.body);
    res.status(201).json(c);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await categoryService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await categoryService.remove(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};