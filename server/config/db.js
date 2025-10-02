const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connection established');
        client.release();
        return true;
    } catch (error) {
        console.log('Database connection failed');
        return false;
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    testConnection
};