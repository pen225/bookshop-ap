const userService = require('../services/userService');

exports.me = async (req, res, next) => {
  try {
    const user = await userService.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    delete user.password_hash;
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const users = await userService.listAll();
    users.forEach(u => delete u.password_hash);
    res.json(users);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (req.user.role !== 'administrateur' && req.user.id !== id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    const updated = await userService.update(id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};