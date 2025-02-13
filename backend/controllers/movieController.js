const { pool } = require("../database/databaseConfig");

// Get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const [movies] = await pool.query("SELECT * FROM movies");
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

// Get a single movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const [movies] = await pool.query("SELECT * FROM movies WHERE id = ?", [
      movie_id,
    ]);

    if (movies.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movies[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
};

// Add a new movie (Admin only)
exports.addMovie = async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, rating } = req.body;
    const release_year = new Date().getFullYear();

    if (!title || !description || !release_year || rating === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await pool.query(
      "INSERT INTO movies (title, description, release_year, ratings) VALUES (?, ?, ?, ?)",
      [title, description, release_year, rating]
    );

    res.status(201).json({ message: "Movie added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie" });
  }
};

// Update a movie (Admin only)
exports.updateMovie = async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { movie_id } = req.params;
    const { title, description, rating } = req.body;
    console.log("---------------", req.body, movie_id);
    const [result] = await pool.query(
      "UPDATE movies SET title = ?, description = ?, ratings = ? WHERE id = ?",
      [title, description, rating, movie_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie" });
  }
};

// Delete a movie (Admin only)
exports.deleteMovie = async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { movie_id } = req.params;

    const [result] = await pool.query("DELETE FROM movies WHERE id = ?", [
      movie_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie" });
  }
};
