const { pool, connectDB } = require("../database/databaseConfig");

exports.addReview = async (req, res) => {
  try {
    const { movie_id, rating, review_text } = req.body;
    const user_id = req.user?.id;

    console.log("User ID from token:", user_id); //  Debugging log

    if (!user_id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    const [result] = await pool.query(
      "INSERT INTO reviews (user_id, movie_id, rating, review_text) VALUES (?, ?, ?, ?)",
      [user_id, movie_id, rating, review_text]
    );

    const [newReview] = await pool.query("SELECT * FROM reviews WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(newReview[0]);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const { sort } = req.query;
    const user_id = req.user?.id; // Extract user ID from authentication middleware

    let orderBy = "r.created_at DESC"; // Default sorting by most recent

    if (sort === "popularity") {
      orderBy = "likes DESC"; // Sort by most liked reviews
    }

    // Fetch reviews with likes count and check if the user has liked them
    const [reviews] = await pool.query(
      `
      SELECT r.*, 
             COALESCE(l.likes, 0) AS likes, 
             EXISTS(SELECT 1 FROM likes WHERE review_id = r.id AND user_id = ?) AS isLiked
      FROM reviews r
      LEFT JOIN (
          SELECT review_id, COUNT(*) AS likes 
          FROM likes 
          GROUP BY review_id
      ) l ON r.id = l.review_id
      WHERE r.movie_id = ?
      ORDER BY ${orderBy}
      `,
      [user_id, movie_id]
    );

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching reviews." });
  }
};


// Get a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const { review_id } = req.params;
    const [review] = await pool.query("SELECT * FROM reviews WHERE id = ?", [
      review_id,
    ]);

    if (review.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a review (only if the user is the owner)
exports.updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { review_text } = req.body;
    const user_id = req.user.id;

    // Fetch the review and extract the first element
    const [review] = await pool.query("SELECT * FROM reviews WHERE id = ?", [
      review_id,
    ]);

    if (review.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the owner
    if (review[0].user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this review" });
    }

    await pool.query("UPDATE reviews SET review_text = ? WHERE id = ?", [
      review_text,
      review_id,
    ]);

    const [updatedReview] = await pool.query(
      "SELECT * FROM reviews WHERE id = ?",
      [review_id]
    );

    res.json(updatedReview[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a review (only if the user is the owner)
exports.deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const user_id = req.user.id;

    // Fetch the review and extract the first element
    const [review] = await pool.query("SELECT * FROM reviews WHERE id = ?", [
      review_id,
    ]);

    if (review.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the owner
    if (review[0].user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review" });
    }

    await pool.query("DELETE FROM reviews WHERE id = ?", [review_id]);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
