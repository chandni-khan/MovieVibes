const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB, pool } = require("./database/databaseConfig");
const apiRoutes = require("./routes/api");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

app.use("/api", apiRoutes);


// Test Database Connection
app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT 1 AS status");
    res.json({ message: "API is running...", db: rows });
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
