require('dotenv').config();
const mysql = require('mysql2');
const { Pool } = require('pg');

const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
};

const postgresConfig = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
        rejectUnauthorized: false
    }
};

const mysqlPool = mysql.createPool(mysqlConfig).promise();
const postgresPool = new Pool(postgresConfig);

module.exports = {
    mysqlPool,
    postgresPool
};
