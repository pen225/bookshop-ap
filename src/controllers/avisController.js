const avisService = require('../services/avisService');

exports.create = async (req, res, next) => {
  try {
    const ouvrageId = Number(req.params.id);
    const clientId = req.user.id;
    const { note, commentaire } = req.body;
    // Service verfie achat
    const avis = await avisService.createIfBought(clientId, ouvrageId, note, commentaire);
    res.status(201).json(avis);
  } catch (err) {
    if (err.message === 'No purchase found') return res.status(403).json({ error: 'Vous devez acheter ce produit pour laisser un avis' });
    next(err);
  }
};