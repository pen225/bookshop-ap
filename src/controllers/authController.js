const authService = require('../services/authService');

// Registration controller
exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email déjà utilisé' });
    next(err);
  }
};


// Login controller
exports.login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};