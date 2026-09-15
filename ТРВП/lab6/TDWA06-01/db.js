const sql = require('mssql');
require('dotenv').config();

const config = {
    user: 'sa', 
    password: 'Testpassword2#', 
    server: 'localhost',
    database: 'Celebrities',
    port: 1434,
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Успешное подключение к MS SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Ошибка подключения к БД:', err.message);
        process.exit(1);
    });

module.exports = { sql, poolPromise };