const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "your_database",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL (XAMPP)");
    connection.release(); // Release connection back to pool
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};

// TEST DATABASE CONNECTION
connectDB();

module.exports = { pool, connectDB };
