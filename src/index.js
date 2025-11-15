const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/ouvrages', require('./routes/ouvrages'));
app.use('/api/panier', require('./routes/panier'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/avis', require('./routes/avis'));
app.use('/api/commentaires', require('./routes/commentaires'));
app.use('/api/listes', require('./routes/listes'));

app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
module.exports = app;
