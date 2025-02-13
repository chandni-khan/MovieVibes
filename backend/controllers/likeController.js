const db = require("../database/databaseConfig");

exports.likeReview = async (req, res) => {
  try {
    const { review_id } = req.body;
    await db.query("INSERT INTO likes (user_id, review_id) VALUES (?, ?)", [
      req.user.userId,
      review_id,
    ]);
    res.status(201).json({ message: "Review liked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unlikeReview = async (req, res) => {
  try {
    const { review_id } = req.body;
    await db.query("DELETE FROM likes WHERE user_id = ? AND review_id = ?", [
      req.user.userId,
      review_id,
    ]);
    res.status(200).json({ message: "Review unliked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
