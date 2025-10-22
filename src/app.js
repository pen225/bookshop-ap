const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const ouvrageRoutes = require('./routes/ouvrages');
const panierRoutes = require('./routes/panier');
const commandeRoutes = require('./routes/commandes');
const listeRoutes = require('./routes/listes');
const avisRoutes = require('./routes/avis');
const commentaireRoutes = require('./routes/commentaires');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ouvrages', ouvrageRoutes);
app.use('/api/panier', panierRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/listes', listeRoutes);
app.use('/api/ouvrages', avisRoutes); // avis routes are nested under ouvrages
app.use('/api/commentaires', commentaireRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// global error handler
app.use(errorHandler);

module.exports = app;
