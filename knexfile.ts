require('dotenv').config({ path: __dirname + './env' });

module.exports = {
  development: {
    client: 'mssql',
    connection: {
      port: process.env.DB_PORT || 1433,
      server: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'wallet',
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || 'Admin@1234'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  }
};
