const db = require("../database/databaseConfig");

exports.getAllMovies = async (req, res) => {
  try {
    const [movies] = await db.query("SELECT * FROM movies");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const { title, description, release_year } = req.body;
    await db.query(
      "INSERT INTO movies (title, description, release_year) VALUES (?, ?, ?)",
      [title, description, release_year]
    );
    res.status(201).json({ message: "Movie added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
