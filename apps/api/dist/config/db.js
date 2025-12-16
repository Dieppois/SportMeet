"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = getConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const databaseUrl = process.env.DATABASE_URL;
const host = process.env.DB_HOST || "localhost";
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USER || "sport_user";
const password = process.env.DB_PASSWORD || "sport_password";
const database = process.env.DB_NAME || "sport_matcher";
const rootUser = process.env.DB_ROOT_USER || "root";
const rootPassword = process.env.DB_ROOT_PASSWORD || "rootpassword";
async function createPoolWithBootstrap() {
    const targetPool = databaseUrl
        ? promise_1.default.createPool(databaseUrl)
        : promise_1.default.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 10 });
    try {
        await targetPool.query("SELECT 1");
        return targetPool;
    }
    catch (err) {
        // If the configured user/db do not exist, try to create them using root creds.
        if (err?.code !== "ER_ACCESS_DENIED_ERROR" && err?.code !== "ER_BAD_DB_ERROR") {
            throw err;
        }
        const bootstrapPool = promise_1.default.createPool({
            host,
            port,
            user: rootUser,
            password: rootPassword,
            waitForConnections: true,
            connectionLimit: 2,
        });
        try {
            await bootstrapPool.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
            await bootstrapPool.query(`CREATE USER IF NOT EXISTS '${user}'@'%' IDENTIFIED BY ?`, [password]);
            await bootstrapPool.query(`GRANT ALL PRIVILEGES ON \`${database}\`.* TO '${user}'@'%'`);
            await bootstrapPool.query("FLUSH PRIVILEGES");
        }
        finally {
            await bootstrapPool.end().catch(() => { });
        }
        const finalPool = databaseUrl
            ? promise_1.default.createPool(databaseUrl)
            : promise_1.default.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 10 });
        await finalPool.query("SELECT 1");
        return finalPool;
    }
}
let poolPromise = null;
async function getPool() {
    if (!poolPromise) {
        poolPromise = createPoolWithBootstrap();
    }
    return poolPromise;
}
async function getConnection() {
    const pool = await getPool();
    return pool.getConnection();
}
async function query(sql, params) {
    const pool = await getPool();
    return pool.query(sql, params);
}
const db = {
    getConnection,
    query,
};
exports.default = db;
