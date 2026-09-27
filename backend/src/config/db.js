const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL bağlantı havuzu yapılandırması
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: {
    rejectUnauthorized: false,
  }
});

// Veritabanı bağlantı hatalarını dinle
pool.on('error', (err, client) => {
  console.error('Beklenmeyen bir veritabanı hatası oluştu', err);
  process.exit(-1);
});

module.exports = pool;
