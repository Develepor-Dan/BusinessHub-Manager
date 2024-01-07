const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "MySQL1015",
  database: "employees",
});

// Export the pool directly
module.exports = pool;
