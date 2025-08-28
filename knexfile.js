require('dotenv').config();

module.exports = {
    development: {
        client: process.env.DB_CLIENT || 'mysql2',
        connection: {
            host: process.env.DB_HOST || '127.0.0.1',
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'api_node_js_test',
            timezone: process.env.DB_TIMEZONE || 'Z',
            charset: process.env.DB_CHARSET || 'utf8mb4'
        },
        pool: { min: 2, max: 10 },
    }
};
