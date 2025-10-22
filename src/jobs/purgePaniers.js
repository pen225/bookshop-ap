const pool = require('../config/db');

async function purge() {
  const days = Number(process.env.PANIER_EXPIRE_DAYS || 30);
  const [rows] = await pool.execute('SELECT id FROM panier WHERE actif = 1 AND updated_at < (NOW() - INTERVAL ? DAY)', [days]);
  for (const p of rows) {
    await pool.execute('DELETE FROM panier_items WHERE panier_id = ?', [p.id]);
    await pool.execute('DELETE FROM panier WHERE id = ?', [p.id]);
    console.log('Purged panier', p.id);
  }
  console.log('Done purge');
}

if (require.main === module) {
  purge().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}