const commandeService = require('../services/commandeService');

exports.create = async (req, res, next) => {
  try {
    const commandeId = await commandeService.createCommande(req.user.id, req.body.items, req.body.adresse_livraison, req.body.mode_paiement);
    res.status(201).json({ id: commandeId });
  } catch (err) {
    if (err.message === 'Stock insuffisant') return res.status(409).json({ error: err.message });
    next(err);
  }
};

exports.listForUser = async (req, res, next) => {
  try {
    const list = await commandeService.listByClient(req.user.id);
    res.json(list);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const cmd = await commandeService.findById(id);
    if (!cmd) return res.status(404).json({ error: 'Commande introuvable' });
    // check ownership or admin
    if (req.user.role !== 'administrateur' && req.user.id !== cmd.client_id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    res.json(cmd);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    if (!['gestionnaire','administrateur'].includes(req.user.role)) return res.status(403).json({ error: 'Accès refusé' });
    const id = Number(req.params.id);
    const { statut } = req.body;
    await commandeService.updateStatus(id, statut, req.user.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};