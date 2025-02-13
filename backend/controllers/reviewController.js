const db = require("../database/databaseConfig");

exports.addReview = async (req, res) => {
  try {
    const { movie_id, rating, review_text } = req.body;
    await db.query(
      "INSERT INTO reviews (user_id, movie_id, rating, review_text) VALUES (?, ?, ?, ?)",
      [req.user.userId, movie_id, rating, review_text]
    );
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const [reviews] = await db.query(
      "SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC",
      [movie_id]
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
