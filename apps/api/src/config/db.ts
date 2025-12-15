import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a MySQL connection pool using DATABASE_URL or individual env vars
const databaseUrl = process.env.DATABASE_URL;

let pool: mysql.Pool;

if (databaseUrl) {
  pool = mysql.createPool(databaseUrl);
} else {
  const host = process.env.DB_HOST || "localhost";
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || "sport_user";
  const password = process.env.DB_PASSWORD || "sport_password";
  const database = process.env.DB_NAME || "sport_matcher";
  pool = mysql.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 10 });
}

export async function getConnection() {
  return pool.getConnection();
}

export default pool;
