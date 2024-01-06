const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit as needed
  host: "localhost",
  user: "root",
  password: "MYSQL1015",
  database: "employees",
});

// Get a promise-based connection from the pool
const promisePool = pool.promise();

// Ensure the connection to the database is successful
promisePool
  .query("SELECT 1")
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the application on connection error
  });

module.exports = promisePool;
