const { pool, connectDB } = require("../database/databaseConfig"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, password, name } = req.body;
  let role = "";

  try {
    // Check if user already exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // By default its users you have to change in database to make it admin by assigning role value to 1
    role = 0;

    // Create a new user
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    // Fetch newly created user
    const [newUser] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser[0].id, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with token and role
    return res
      .status(201)
      .json({ token, role, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // Ensure a valid user was found
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user[0]; // Get the first result
    console.log(password, userData.password,user[0]);
    if (!userData.password) {
      return res
        .status(500)
        .json({ message: "Internal error: Password not found in database" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with token and role
    return res.status(200).json({ token, role: userData.role });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};


module.exports = { register, login };
