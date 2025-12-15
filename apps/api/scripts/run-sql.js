// Simple SQL runner for mysql_schema.sql using mysql2
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const file = process.argv[2];
    if (!file) {
      console.error('Usage: node scripts/run-sql.js <path-to-sql-file>');
      process.exit(1);
    }
    const sqlPath = path.resolve(process.cwd(), file);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    const databaseUrl = process.env.DATABASE_URL;
    let pool;
    if (databaseUrl) {
      pool = await mysql.createPool(databaseUrl);
    } else {
      const host = process.env.DB_HOST || 'localhost';
      const port = Number(process.env.DB_PORT || 3306);
      const user = process.env.DB_USER || 'sport_user';
      const password = process.env.DB_PASSWORD || 'sport_password';
      const database = process.env.DB_NAME || 'sport_matcher';
      pool = await mysql.createPool({ host, port, user, password, database, multipleStatements: true });
    }

    console.log('Running SQL file:', sqlPath);
    await pool.query(sql);
    console.log('SQL executed successfully.');
    process.exit(0);
  } catch (e) {
    console.error('Failed to run SQL:', e);
    process.exit(1);
  }
})();
