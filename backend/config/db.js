const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
    server: 'DESKTOP-93P64K2\\SQLEXPRESS09',
    database: 'AIFreelance',
    driver: 'ODBC Driver 18 for SQL Server',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log('SQL Server connected successfully!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
};

module.exports = { sql, connectDB };