const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_HOST:', process.env.DB_HOST);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD?.toString(),
  port: process.env.DB_PORT,
});

// Test PostgreSQL connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database.'))
  .catch(err => {
    console.error('Database connection error:', err.stack);
    process.exit(1); // Exit if the connection fails
  });

module.exports = pool;
